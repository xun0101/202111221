import users from '../models/users.js'
import products from '../models/products.js'

export const createUser = async (req, res) => {
  try {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
      res.status(400).send({ success: false, message: '資料格式不正確' })
      return
    }
    const result = await users.create(req.body)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號或信箱重複' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const addCart = async (req, res) => {
  try {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
      res.status(400).send({ success: false, message: '資料格式不正確' })
      return
    }

    // 檢查傳入的資料
    if (!req.body.pid) {
      res.status(400).send({ success: false, message: '缺少商品資訊' })
      return
    }
    if (!req.body.quantity) {
      res.status(400).send({ success: false, message: '缺少商品數量' })
      return
    }
    if (typeof req.body.quantity !== 'number') {
      res.status(400).send({ success: false, message: '資料格式不正確' })
      return
    }

    // 檢查商品是否存在
    let result = await products.findById(req.body.pid)
    if (!result) {
      res.status(404).send({ success: false, message: '查無商品' })
      return
    }

    // 單純的 push，沒有檢查資料
    // const result = await users.findByIdAndUpdate(req.params.id, {
    //   // 把 req.body 的內容 push 進 cart 陣列
    //   $push: {
    //     cart: req.body
    //   }
    // }, { new: true, runValidators: true })

    result = await users.findById(req.params.id, 'cart')
    if (!result) {
      res.status(404).send({ success: false, message: '查無使用者' })
      return
    }

    // 檢查商品是否在購物車內
    const idx = result.cart.findIndex(product => {
      // product.pid 的資料型態是 objectId，不能直接跟文字比，所以要用 .toString() 轉
      return product.pid.toString() === req.body.pid
    })

    if (idx > -1) {
      // 在購物車內的話，加數量
      result.cart[idx].quantity += req.body.quantity
      // 如果數量處理後小於 0，從購物車移除
      if (result.cart[idx].quantity <= 0) {
        result.cart.splice(idx, 1)
      }
    } else {
      // 不在購物車內，push
      result.cart.push(req.body)
    }
    result.save()
    res.status(200).send({ success: true, message: '', result })
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

export const getUser = async (req, res) => {
  try {
    const result = await users.findById(req.params.id, '-cart')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: '資料格式不正確' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getUserCart = async (req, res) => {
  try {
    // .propulate(有ref欄位的路徑。 { 欄位名:1/0 是否顯示 })
    // .populate('cart.pid', { name: 1 })
    const result = await users.findById(req.params.id, 'cart').populate('cart.pid')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: '資料格式不正確' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
