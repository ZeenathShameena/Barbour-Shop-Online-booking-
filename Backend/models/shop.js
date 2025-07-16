const mongoose = require('mongoose')

const shopStatusSchema = new mongoose.Schema({
  status:{
    type:String,
    enum:['open','closed'],
    default:'closed'
  },
  openingTime:{
    type:String
  },
  closingTime:{
    type:String
  },
  Category:{
    title: { type: String },
    price: { type: String },
  }
})

module.exports = mongoose.model('ShopStatus',shopStatusSchema)