import express from 'express'
import orderModel from "../models/orderModel.js"
import productModel from '../models/productModel.js'

const orderRoute = express.Router()

orderRoute.get('/list', async (req, res) => {
    try {
        const { user_id, status, page = 1, limit = 10 } = req.query
        
        const filter = {}
        if (user_id) filter.user_id = user_id
        if (status) filter.order_status = status
        
        const skip = (Number(page) - 1) * Number(limit)
        const [orders, total] = await Promise.all([
            orderModel.find(filter).sort('-created_at').skip(skip).limit(Number(limit)).populate('user_id', 'name email'),
            orderModel.countDocuments(filter)
        ])
        
        res.status(200).json({
            orders,
            pagination: {
                current_page: Number(page),
                total_pages: Math.ceil(total / Number(limit)),
                total_items: total
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

orderRoute.get('/:id', async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)
            .populate('user_id', 'name email')
            .populate('items.product_id', 'sku name')
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' })
        }
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

orderRoute.post('/create', async (req, res) => { // -> realizar orden (compra de productos)
    try {
        const { user_id, items, shipping = 0, discount = 0, tax = 0, payment, notes } = req.body
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'La orden debe tener al menos un producto' })
        }
        
        const productIds = items.map(i => i.product_id)
        const products = await productModel.find({ _id: { $in: productIds } })
        
        const orderItems = []
        let subtotal = 0
        
        for (const item of items) {
            const product = products.find(p => p._id.toString() === item.product_id)
            if (!product) {
                return res.status(400).json({ error: `Producto ${item.product_id} no encontrado` })
            }
            
            const itemSubtotal = product.price * item.quantity
            subtotal += itemSubtotal
            
            orderItems.push({
                product_id: product._id,
                name: product.name,
                photo: product.primary_image,
                quantity: item.quantity,
                unit_price: product.price,
                currency: 'PEN',
                subtotal: itemSubtotal
            })
        }
        
        const grand_total = subtotal - discount + shipping + tax
        
        const order = await orderModel.create({
            user_id,
            items: orderItems,
            totals: { subtotal, discount, shipping, tax, grand_total },
            payment,
            notes
        })
        
        res.status(201).json(order)
    } catch (error) {
        console.error('Error creando orden:', error)
        res.status(500).json({ error: error.message })
    }
})

orderRoute.put('/:id/status', async (req, res) => {
    try {
        const { order_status } = req.body
        const updated = await orderModel.findByIdAndUpdate(
            req.params.id,
            { order_status },
            { new: true }
        )
        if (!updated) {
            return res.status(404).json({ error: 'Orden no encontrada' })
        }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

orderRoute.put('/:id/payment', async (req, res) => {
    try {
        const { method } = req.body
        const updated = await orderModel.findByIdAndUpdate(
            req.params.id,
            { 
                payment: { method, paid_at: new Date() },
                order_status: 'Verificado'
            },
            { new: true }
        )
        if (!updated) {
            return res.status(404).json({ error: 'Orden no encontrada' })
        }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

orderRoute.put('/:id/cancel', async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' })
        }
        if (order.order_status === 'Verificado') {
            return res.status(400).json({ error: 'No se puede cancelar una orden verificada' })
        }
        
        order.order_status = 'Cancelado'
        await order.save()
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default orderRoute