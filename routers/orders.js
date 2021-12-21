import express from 'express'
import { checkout, getOrders } from '../controllers/orders.js'

const router = express.Router()
router.post('/:id', checkout)
router.get('/', getOrders)

export default router
