import express from 'express'
import { createUser, addCart, getUser, getUserCart } from '../controllers/users.js'

const router = express.Router()

router.post('/', createUser)
router.post('/:id/cart', addCart)
router.get('/:id', getUser)
router.get('/:id/cart', getUserCart)

export default router
