import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  pid: {
    type: mongoose.ObjectId,
    ref: 'products',
    required: [true, '缺少商品資訊']
  },
  quantity: {
    type: Number,
    required: [true, '缺少商品數量'],
    min: [0, '無效的商品數量']
  }
}, { versionKey: false })

const orderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  uid: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者資訊']
  },
  products: {
    type: [cartSchema]
  }
}, { versionKey: false })

export default mongoose.model('orders', orderSchema)
