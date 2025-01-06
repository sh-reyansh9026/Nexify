import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    chatId: {
        type: String,
    },
    deletedBy: { // Array of userIds who deleted this message for "Delete for me"
        type: [mongoose.Schema.Types.ObjectId],
    },
    isDeletedForEveryone: { // If this message is deleted for everyone
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
