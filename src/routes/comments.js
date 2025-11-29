import express from 'express'
import commentModel from "../models/commentModel.js"

const commentRoute = express.Router()

commentRoute.get('/review/:review_id', async (req, res) => {
    try {
        const comments = await commentModel.find({ 
            review_id: req.params.review_id,
            status: 'published'
        }).populate('user_id', 'name').sort('created_at')
        
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

commentRoute.post('/create', async (req, res) => {
    try {
        const { review_id, product_id, user_id, parent_id, body } = req.body
        
        const comment = await commentModel.create({
            review_id,
            product_id,
            user_id,
            parent_id: parent_id || null,
            body,
            status: 'published'
        })
        
        res.status(201).json(comment)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

commentRoute.put('/:id/admin/moderate', async (req, res) => {
    try {
        const { status } = req.body
        const updated = await commentModel.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        if (!updated) {
            return res.status(404).json({ error: 'Comentario no encontrado' })
        }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

commentRoute.delete('/delete/:id', async (req, res) => {
    try {
        const deleted = await commentModel.findByIdAndDelete(req.params.id)
        if (!deleted) {
            return res.status(404).json({ error: 'Comentario no encontrado' })
        }
        res.status(200).json({ message: 'Comentario eliminado' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default commentRoute