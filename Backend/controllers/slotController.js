const express = require('express');
const Shop = require('../models/shop');
const TimeSlot = require('../models/timeSlot');
const User = require('../models/client');


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

exports.openShop = async (req, res) => {
  const { openingTime, closingTime } = req.body;

  await Shop.updateOne({}, { status: 'open', openingTime, closingTime }, { upsert: true });

  const slots = generateSlots(openingTime, closingTime);
  await TimeSlot.deleteMany({});
  await TimeSlot.insertMany(slots);
  res.json({ message: 'Shop opened and slots generated' });
};

exports.closeShop = async (req, res) => {
  await Shop.updateOne({}, { status: 'closed' });
  await TimeSlot.deleteMany({});

  res.json({ message: 'Shop closed and all slots reset' });
};

exports.bookSlot = async (req, res) => {
  const { userId, slotId, selectedCategory } = req.body;

  const slot = await TimeSlot.findById(slotId);
  if (!slot || slot.isBooked) {
    return res.json({ message: 'Slot not available' });
  }

  slot.isBooked = true;
  slot.bookedBy = userId;
  slot.selectedCategory= selectedCategory;

  await slot.save();

  const user = await User.findById(userId);
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

exports.getUserBookedSlots = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const bookedSlots = await TimeSlot.find({ bookedBy: userId })
      .populate('bookedBy', 'name')
      .sort({ slot: 1 });

    res.json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
