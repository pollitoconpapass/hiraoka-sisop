import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        items : [
            {
                product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
                name: { type: String, required: true },
                photo: { type: String },
                quantity: { type: Number, required: true },
                unit_price: { type: Number, required: true },
                currency: {type: String, required: true},
                subtotal: { type: Number, required: true}
            }
        ],
        totals: {
            subtotal: {type: Number, required: true},
            discount: {type: Number, default: 0},
            shipping: {type: Number, default: 0},
            tax: { type: Number, default: 0},
            grand_total: { type: Number, required: true}
        },
        order_status: {type: String, enum: ['Verificado', 'En Proceso', 'Cancelado'], default: 'En Proceso'},
        payment: {
            method: { type: String, enum: [ 'tarjeta', 'yape', 'plin', 'transferencia', 'efectivo', 'otro']},
            transaction_id: {type: String},
            paid_at: { type: Date }
        },
        notes: { type: String }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
    
)

const orderModel = mongoose.model('orders', orderSchema)
export default orderModel