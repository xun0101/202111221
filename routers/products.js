import express from 'express'
import { createProuct } from '../controllers/products.js'

const router = express.Router()
router.post('/', createProuct)

export default router
