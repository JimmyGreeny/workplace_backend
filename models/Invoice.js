const mongoose = require('mongoose')

const serviceRow = new mongoose.Schema({
    serviceRow_id: {
      type: String
    },
    title: {
      type: String
    },
    price: {
      type: Number
    },
    vat: {
      type: Number
    },
    count: {
      type: Number
    },
    sum: {
      type: Number
    }
  });
  
  const materialRow = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'InvoiceMaterial'
    },
    item: {
      type: String
    },
    measure: {
      type: String
    },
    price: {
      type: Number,
      default : 0
    },
    vat: {
      type: Number
    },
    count: {
      type: Number,
      default : 0
    },
    sum: {
      type: Number
    }
  });
  
  const InvoiceSchema = new mongoose.Schema({
    username: {
      type: String
    },
    serviceRows: {
      type: [serviceRow],
      default: () => ({})
    },
    srows_sum_no_vat: {
      type: Number
    },
    srows_VAT: {
      type: Number
    },
    materialRows: {
      type: [materialRow],
      default: () => ({})
    },
    mrows_sum_no_vat: {
      type: Number
    },
    mrows_VAT: {
      type: Number
    },
    published_date: {
      type: Date,
      default: Date.now
    },
    total_sum_no_vat: {
      type: Number
    },
    total_sum: {
      type: Number
    },
  });

module.exports = mongoose.model('Invoice', InvoiceSchema)