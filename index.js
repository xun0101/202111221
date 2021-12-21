import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import usersRouter from './routers/users.js'
import productsRouter from './routers/products.js'
import ordersRouter from './routers/orders.js'

mongoose.connect(process.env.DB_URL, () => {
  console.log('Database connected.')
})

const app = express()

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '資料格式不正確' })
})

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).send({ success: false, message: '伺服器錯誤' })
})

app.listen(process.env.PROT || 3000, () => {
  console.log('Sever started.')
})
