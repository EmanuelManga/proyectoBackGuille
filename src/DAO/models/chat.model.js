import mongoose, { Schema, model } from "mongoose";

const chatSchema = new Schema({
    mensajes: [
        {
            // _id: false,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
            message: { type: String, required: true, max: 155 },
            date: { type: Date, default: Date.now },
        },
    ],
});

export const ChatModel = model("chat", chatSchema);
