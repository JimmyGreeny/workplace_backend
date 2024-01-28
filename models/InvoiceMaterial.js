const mongoose = require('mongoose')

const MaterialItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  item: {
    type: String
  },
  measure: {
    type: String
  },
  in_stock: {
    type: Number,
    default: null
  },
  price: {
    type: Number,
    default: null
  },
  index: {
    type: Number,
    default: null
  }//,
  //  updated_date: {
  //    type: Date,
  //    default: Date.now
  //  }
});

module.exports = mongoose.model('InvoiceMaterial', MaterialItemSchema)