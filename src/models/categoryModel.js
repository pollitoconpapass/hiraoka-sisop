import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', default: null },
        path: { type: Array, default: [] },
    }
)

const categoryModel = mongoose.model('categories', categorySchema)
export default categoryModel