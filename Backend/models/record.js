const mongoose = require('mongoose')

const RecordSchema = new mongoose.Schema({
  Day:{
    type: String,
    default: () => {
        const today = new Date();
        return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
      }
  },
  openingTime:{
    type:String
  },
  closingTime:{
    type:String
  },
  BookedSlots:[
    {
            slot:{
                type:String,
                required:true
            },
            selectedCategory:{
                type:String
            },
            bookedBy:{
                id:{
                  type:mongoose.Schema.Types.ObjectId,
                  ref:'client',
                  default:null
                },
                name: { type: String }
            }
        
    }
  ]

})
module.exports = mongoose.model('Records',RecordSchema)