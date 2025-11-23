import express from 'express'
import reviewModel from "../models/reviewModel.js"
import productModel from '../models/productModel.js'
import orderModel from '../models/orderModel.js'

const reviewRoute = express.Router()

reviewRoute.get('/product/:product_id', async (req, res) => {
    try {
        const { status = 'published', page = 1, limit = 10 } = req.query
        const filter = { product_id: req.params.product_id, status }
        
        const skip = (Number(page) - 1) * Number(limit)
        const [reviews, total] = await Promise.all([
            reviewModel.find(filter).sort('-created_at').skip(skip).limit(Number(limit)).populate('user_id', 'name'),
            reviewModel.countDocuments(filter)
        ])
        
        res.status(200).json({
            reviews,
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

reviewRoute.get('/:id', async (req, res) => {
    try {
        const review = await reviewModel.findById(req.params.id)
            .populate('user_id', 'name')
            .populate('product_id', 'name sku primary_image')
        if (!review) {
            return res.status(404).json({ error: 'Reseña no encontrada' })
        }
        res.status(200).json(review)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

reviewRoute.post('/create', async (req, res) => {
    try {
        const { product_id, user_id, title, body, rating, pros, cons } = req.body
        
        // Verificar si el usuario ya reseñó este producto
        const existing = await reviewModel.findOne({ product_id, user_id })
        if (existing) {
            return res.status(400).json({ error: 'Ya has reseñado este producto' })
        }
        
        // Verificar si el usuario compró el producto
        const hasPurchased = await orderModel.findOne({
            user_id,
            'items.product_id': product_id,
            order_status: 'Verificado'
        })
        
        const review = await reviewModel.create({
            product_id,
            user_id,
            title,
            body,
            rating,
            pros,
            cons,
            purchase_verified: !!hasPurchased,
            status: 'pending'
        })
        
        res.status(201).json(review)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

reviewRoute.put('/:id/admin/moderate', async (req, res) => {
    try {
        const { status, reason, moderator_id } = req.body
        
        const review = await reviewModel.findByIdAndUpdate(
            req.params.id,
            {
                status,
                moderation: {
                    reason,
                    by_user_id: moderator_id,
                    at: new Date()
                }
            },
            { new: true }
        )
        
        if (!review) {
            return res.status(404).json({ error: 'Reseña no encontrada' })
        }
        
        // Si se publica, actualizar rating del producto
        if (status === 'published') {
            await updateProductRating(review.product_id)
        }
        
        res.status(200).json(review)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

reviewRoute.put('/:id/helpful', async (req, res) => {
    try {
        const review = await reviewModel.findByIdAndUpdate(
            req.params.id,
            { $inc: { helpful_count: 1 } },
            { new: true }
        )
        if (!review) {
            return res.status(404).json({ error: 'Reseña no encontrada' })
        }
        res.status(200).json({ helpful_count: review.helpful_count })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

async function updateProductRating(product_id) {
    const stats = await reviewModel.aggregate([
        { $match: { product_id, status: 'published' } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])
    
    if (stats.length > 0) {
        await productModel.findByIdAndUpdate(product_id, {
            'ratings.avg': Math.round(stats[0].avg * 10) / 10,
            'ratings.count': stats[0].count,
            reviews_count: stats[0].count
        })
    }
}

export default reviewRoute