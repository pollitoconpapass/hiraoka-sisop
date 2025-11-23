import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, pattern: `^[^@]+@[^@]+\\.[^@]+$` },
        password_hash: { type: String },
        role: { type: String, enum: ["admin","cliente"] },
        status: { type: String, enum: ["active","blocked"] }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        versionKey: false
    }
)

const userModel = mongoose.model("users", userSchema)
export default userModel 