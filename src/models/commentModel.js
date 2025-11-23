import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
    {
        review_id: { type: mongoose.Schema.Types.ObjectId, ref: 'reviews', required: true},
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true},
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
        parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'comments', required: true},
        body: { type: String },
        status: { type: String, enum: ['pending', 'published', 'rejected'] },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const commentModel = mongoose.model('comments', commentSchema)
export default commentModel