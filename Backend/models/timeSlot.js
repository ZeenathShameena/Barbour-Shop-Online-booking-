const mongoose = require('mongoose')

const timeSlotSchema = new mongoose.Schema({
    slot:{
        type:String,
        required:true
    },
    
    isBooked:{
        type:Boolean,
        default:false
    },
    bookedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'client',
        default:null,
    }
})
module.exports = mongoose.model('TimeSlot',timeSlotSchema)