import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
    {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true},
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
        title: { type: String },
        body: { type: String, required: true},
        rating: { type: Number, min: 1, max: 5, required: true },
        pros: [
            {type: String}
        ],
        cons: [
            {type: String}
        ],
        purchase_verified: { type: Boolean, default: false },
        helpful_count: { type: Number, default: 0 },
        status: { type: String, enum: ['pending', 'published', 'rejected']},
        moderation: {
            flags: [
                { type: String}
            ],
            reason: { type: String },
            by_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
            at: { type: Date }
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const reviewModel = mongoose.model('reviews', reviewSchema)
export default reviewModel