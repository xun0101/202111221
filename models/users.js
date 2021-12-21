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

const userSchema = new mongoose.Schema({
  account: {
    type: String,
    required: [true, '缺少帳號欄位']
  },
  cart: {
    type: [cartSchema],
    default: []
  }
}, { versionKey: false })

export default mongoose.model('users', userSchema)
