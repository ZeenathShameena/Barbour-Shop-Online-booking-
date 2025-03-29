const express = require('express');
const Shop = require('../models/shop');
const TimeSlot = require('../models/timeSlot');
const User = require('../models/client');
const records = require('../models/record')


const generateSlots = (openingTime, closingTime) => {
  let slots = [];
  let startTime = new Date(`1970-01-01T${openingTime}:00`);
  let endTime = new Date(`1970-01-01T${closingTime}:00`);

  // Round up startTime to the next full 20-minute slot if it is not on a 20-minute mark
  let minutes = startTime.getMinutes();
  let remainder = minutes % 20;
  if (remainder !== 0) {
    startTime.setMinutes(minutes + (20 - remainder));
  }

  while (startTime < endTime) {
    let slotEnd = new Date(startTime.getTime() + 20 * 60000);
    
    if (slotEnd <= endTime) {
      slots.push({
        slot: `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`,
        isBooked: false
      });
    }

    startTime = slotEnd;
  }
  return slots;
};


exports.GenerateSlot = async (req, res) => {
  const { openingTime, closingTime } = req.body;

  await Shop.updateOne({}, { openingTime, closingTime }, { upsert: true }); 
  const slots = generateSlots(openingTime, closingTime);
  await TimeSlot.deleteMany({});
  await TimeSlot.insertMany(slots);
  res.json({ message: 'Slots generated' });
};

exports.openShop = async (req, res) => {

  await Shop.updateOne({}, { status: 'open'}); 
  res.json({ message: 'Shop opened ' });
};

exports.closeShop = async (req, res) => {
  await Shop.updateOne({}, { status: 'closed' });
  //await TimeSlot.deleteMany({});

  res.json({ message: 'Shop closed' });
};

exports.bookSlot = async (req, res) => {
  const { userId, slotId, selectedCategory } = req.body;
 
  // Check if the user has already booked a slot
  const existingBooking = await TimeSlot.countDocuments({ "bookedBy.id": userId });
  if (existingBooking >= 2) {
    return res.json({ message: 'you can only book 2 slots per day' });
  }

  const slot = await TimeSlot.findById(slotId);
  if (!slot || slot.isBooked) {
    return res.json({ message: 'Slot not available' });
  }

    // Fetch the user's name from the User collection
  const user = await User.findById(userId);
  if (!user) {
    return res.json({ message: 'User not found' });
  }
  slot.isBooked = true;
  slot.bookedBy = { 
    id: userId, 
    name: user.name,
    mobile: user.mobile,
    address: user.address,
    email: user.email 
  };
  slot.selectedCategory= selectedCategory;

  await slot.save();

  if (user && user.expoPushToken) {
    await sendNotification(user.expoPushToken, 'Booking Confirmed', `Your slot ${slot.slot} is confirmed`);
  }

  res.json({ message: 'Slot booked successfully' });
};

exports.getSlots = async (req, res) => {
  try {
    const availableSlots = await TimeSlot.find({ isBooked: false });
    const bookedSlots = await TimeSlot.find({ isBooked: true }).populate('bookedBy', 'name');

    res.json({ availableSlots, bookedSlots });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.updateRecords = async (req, res) => {
  try {
    const bookedSlots = await TimeSlot.find({ isBooked: true })
    const Time = await Shop.find({})

    // Create a new record for the day with the booked slots
    const newRecord = new records({
      BookedSlots: bookedSlots.map(slot => ({
        slot: slot.slot,
        selectedCategory: slot.selectedCategory,
        bookedBy:  slot.bookedBy
      })),
    openingTime : Time[0].openingTime,
    closingTime: Time[0].closingTime
    });

    // Save the record in the database
    await newRecord.save();
    res.json({ message: 'Records updated successfully', record: newRecord });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.getUserBookedSlots = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const bookedSlots = await TimeSlot.find({ "bookedBy.id": userId })
    .select("bookedBy.name selectedCategory slot")
    .sort({ slot: 1 });

    res.json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
