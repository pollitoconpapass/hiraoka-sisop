import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        sku: { type: String, unique: true, required: true },
        name: {type: String, required: true},
        brand: {type: String},
        category_id: {type: mongoose.Schema.Types.ObjectId, ref: "categories"},
        price: {type: Number, required: true},
        specs: {type: Object},
        images: {type: [String], required: true},
        primary_image: {type: String},
        ratings: {
            avg: { type: Number, min: 0, max: 5, default: 0 },
            count: { type: Number, default: 0 },
            breakdown: { type: Object }
        },
        reviews_count: {type: Number, default: 0},
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        versionKey: false
    }
)

const productModel = mongoose.model("products", productSchema)
export default productModel