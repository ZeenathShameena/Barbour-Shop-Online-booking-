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
    selectedCategory:{
        type:String
    },
    bookedBy:{
            id:{
              type:mongoose.Schema.Types.ObjectId, ref:'client',
              default:null
            },
            name: { type: String },
            mobile: { type: String },
            address: { type: String },
            email: { type: String }
        
    }
})
module.exports = mongoose.model('TimeSlot',timeSlotSchema)