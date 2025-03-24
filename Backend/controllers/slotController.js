const express = require('express')
const shop = require('../models/shop')
const timeSlot = require('../models/timeSlot')
const user = require('../models/client')

const generateSlots = (openingTime,closingTime)=>{
  let slots = []
  let startTime =  new Date(`1970-01-01T${openingTime}:00`);
  let endTime = new Date(`1970-01-01T${closingTime}:00`);

  while(startTime < endTime){
    let slotEnd = new Date(startTime.getTime()+ 20*60000)
    slots.push({
      slot:`${startTime.toLocaleDateString([],{hour:'2-digit',minute:'2-digit'})}-${slotEnd.toLocaleDateString([],{hour:'2-digit',minute:'2-digit'})}`,
      isBooked:false
    })
    startTime = slotEnd;
  }
  return slots;
}

exports.openShop = async (req,res)=>{
  const {openingTime,closingTime}= req.body;

  await shop.updateOne({},{status:'open',openingTime,closingTime},{upsert:true})

  const slots = generateSlots(openingTime,closingTime)
  await timeSlot.deleteMany({})
  await timeSlot.insertMany(slots)

  res.json({message:'Shop opened and slots generated'})
}

exports.closeShop = async (req,res)=>{
  await shop.updateOne({},{status:'closed'})
  await timeSlot.deleteMany({})

  res.json({message:'Shop closed and all slots reset'})
}

exports.bookSlot = async (req,res)=>{
  const {userId,slotId}= req.body;

  const slot = await timeSlot.findById(slotId)

  if(!slot || slot.isBooked){
    return res.json({message:'Slot not available'})
  }

  slot.isBooked = true;
  slot.bookedBy = userId;
  await slot.save()

  const user = await user.findById(userId)
  if(user && user.expoPushToken){
    await sendNotification(user.expoPushToken,'Booking Confirmed',`Your slot ${slot.slot} is confirmed`)
  }
  res.json({message:'Slot booked successfully'})
}

