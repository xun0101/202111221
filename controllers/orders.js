import orders from '../models/orders.js'
import users from '../models/users.js'

export const checkout = async (req, res) => {
  try {
    // 取出購物車內容
    let result = await users.findById(req.params.id, 'cart')
    const products = result.cart
    if (products.length > 0) {
      // 清空購物車
      result.cart = []
      // 保存
      result.save()
      // 將購物車內容當成訂單內的商品
      result = await orders.create({ uid: req.params.id, products })
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(400).send({ success: false, message: '購物車是空的' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: '資料格式不正確' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getOrders = async (req, res) => {
  try {
    const result = await orders.find().populate([
      { path: 'uid', select: '-cart' },
      { path: 'products.pid' }
    ])
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
