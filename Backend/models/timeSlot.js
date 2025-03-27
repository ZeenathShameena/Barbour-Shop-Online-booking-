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
        type:mongoose.Schema.Types.ObjectId,
        ref:'client',
        default:null,
    }
    // bookedBy: [
    //     {
    //         _id: { type: mongoose.Schema.Types.ObjectId, ref: "client" }, // Reference Freelancer model
    //         name: { type: String },
    //         email: {type: String},
    //         mobile: {type: String},
    //         Address: {type: String}
        
    //     }
    //]
})
module.exports = mongoose.model('TimeSlot',timeSlotSchema)