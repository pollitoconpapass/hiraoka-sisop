import express from 'express'
import userModel from '../models/userModel.js'

const userRoute = express.Router()

userRoute.get('/list', async (req, res) => { // -> todos los usuarios
    try {
        const users = await userModel.find({})
        res.status(200).json(users)
    } catch(error){
        res.status(500).json({ error: error.message })
    }
    
})

userRoute.get('/:id', async (req, res) => { // -> usuario por id
    try {
        const userId = req.params.id
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send(`Usuario con id ${userId} no encontrado`)
        }
        res.status(200).json(user)
    } catch (error){
        res.status(500).json({ error: error.message })
    }
    
})

userRoute.post('/create', async (req, res) =>{ // -> crear un nuevo usuario
    try {
        const { name, email, password_hash, role, status } = req.body
        const saveduser = await userModel.create({name, email, password_hash, role, status})
        res.status(201).json(saveduser)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

userRoute.post('/login', async(req, res) => {
    try {
        const { email, password_hash } = req.body
        const user = await userModel.findOne({email, password_hash})
        if (!user) {
            return res.status(401).send('Credenciales inválidas')
        }
        res.status(200).json(user)
    } catch(error){
        res.status(500).json({ error: error.message })
    }
})

userRoute.put('/update/:id', async (req, res) => { // -> actualizar un usuario por id
    try {
        const userId = req.params.id
        const { name, email, password_hash, role, status } = req.body
        const updatedUser = await userModel.findByIdAndUpdate(userId, { name, email, password_hash, role, status }, { new: true })

        if (!updatedUser) {
            return res.status(404).send(`Usuario con id ${userId} no encontrado`)
        }

        res.status(200).json(updatedUser)
    } catch (error){
        res.status(500).json({ error: error.message })
    }
})

userRoute.delete('/delete/:id', async (req, res) => { // -> eliminar un usuario por id
    try {
        const userId = req.params.id
        const deletedUser = await userModel.findByIdAndDelete(userId)

        if (!deletedUser) {
            return res.status(404).send(`Usuario con id ${userId} no encontrado`)
        }

        res.status(200).send(`Usuario con id ${userId} eliminado`)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default userRoute
