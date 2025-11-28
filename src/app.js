import express from 'express'
import mongoose from "./database.js"
import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"
import cors from "cors"
import categoryRoute from './routes/categories.js'
import commentRoute from './routes/comments.js'
import orderRoute from './routes/orders.js'
import productRoute from './routes/products.js'
import reviewRoute from './routes/reviews.js'
import userRoute from './routes/users.js'

// Para extraer la info del .env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({
    path: path.join(__dirname, "../.env")
})

// Inicializacion de express
const app = express()
app.use(cors())
app.use(express.json())

// Endpoints generales
app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/db", (req, res) => {
    if(mongoose.connection.readyState) {
        res.send("Database connected") 
    } else {
        res.send("Database not connected")
    }
})

// Llamar a los otros endpoints
app.use("/categories", categoryRoute)
app.use("/comments", commentRoute)
app.use("/orders", orderRoute)
app.use("/products", productRoute)
app.use("/reviews", reviewRoute)
app.use("/users", userRoute)

// Iniciar el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

