import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.join(__dirname, "../.env")
})

try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log(`Database connected to ${process.env.MONGO_URL}`)
} catch (err) {
    console.log(err)
}


export default mongoose