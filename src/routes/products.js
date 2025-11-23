import express from 'express'
import productModel from '../models/productModel.js'

const productRoute = express.Router()

productRoute.get('/list', async (req, res) => {
    try {
        const { category_id, brand, min_price, max_price, page = 1, limit = 10, sort = '-created_at' } = req.query
        
        const filter = {}
        if (category_id) filter.category_id = category_id
        if (brand) filter.brand = { $regex: brand, $options: 'i' }
        if (min_price || max_price) {
            filter.price = {}
            if (min_price) filter.price.$gte = Number(min_price)
            if (max_price) filter.price.$lte = Number(max_price)
        }
        
        const skip = (Number(page) - 1) * Number(limit)
        const [products, total] = await Promise.all([
            productModel.find(filter).sort(sort).skip(skip).limit(Number(limit)).populate('category_id', 'name'),
            productModel.countDocuments(filter)
        ])
        
        res.status(200).json({
            products,
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

productRoute.get('/search', async (req, res) => {
    try {
        const { q } = req.query
        if (!q) return res.status(400).json({ error: 'Parámetro de búsqueda requerido' })
        
        const products = await productModel.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { brand: { $regex: q, $options: 'i' } },
                { sku: { $regex: q, $options: 'i' } }
            ]
        }).limit(20)
        
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

productRoute.get('/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).populate('category_id', 'name path')
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

productRoute.post('/admin/create', async (req, res) => {
    try {
        const productData = {
            ...req.body,
            ratings: { avg: 0, count: 0 },
            reviews_count: 0
        }
        const product = await productModel.create(productData)
        res.status(201).json(product)
    } catch (error) {
        if (error.code === 11000) {
            console.log(error.message)
            return res.status(400).json({ error: 'El SKU ya existe' })
        }
        res.status(500).json({ error: error.message })
        console.log(error)
    }
})

productRoute.put('/admin/update/:id', async (req, res) => {
    try {
        const updated = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updated) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

productRoute.delete('/admin/delete/:id', async (req, res) => {
    try {
        const deleted = await productModel.findByIdAndDelete(req.params.id)
        if (!deleted) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.status(200).json({ message: 'Producto eliminado' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


export default productRoute