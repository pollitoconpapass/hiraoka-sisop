import express from 'express'
import categoryModel from "../models/categoryModel.js"

const categoryRoute = express.Router()

categoryRoute.get('/list', async (req, res) => {
    try {
        const categories = await categoryModel.find({})
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

categoryRoute.get('/:id', async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' })
        }
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

categoryRoute.post('/admin/create', async (req, res) => {
    try {
        const { name } = req.body
        
        const category = await categoryModel.create({ name })
        res.status(201).json(category)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' })
        }
        res.status(500).json({ error: error.message })
    }
})

categoryRoute.put('/admin/update/:id', async (req, res) => {
    try {
        const { name } = req.body
        const updated = await categoryModel.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        )
        if (!updated) {
            return res.status(404).json({ error: 'Categoría no encontrada' })
        }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

categoryRoute.delete('/admin/delete/:id', async (req, res) => {
    try {
        const hasChildren = await categoryModel.findOne({ parent_id: req.params.id })
        if (hasChildren) {
            return res.status(400).json({ error: 'No se puede eliminar, tiene subcategorías' })
        }
        
        const deleted = await categoryModel.findByIdAndDelete(req.params.id)
        if (!deleted) {
            return res.status(404).json({ error: 'Categoría no encontrada' })
        }
        res.status(200).json({ message: 'Categoría eliminada' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default categoryRoute