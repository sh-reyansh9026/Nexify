import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar = async (req, res) => { 
     try {
         const loggedInUserId = req.user._id; // checking which users are loggedIn to show in sidebar
         const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // finding all users except the loggedIn user they are not shown in sidebar ne: means not equal to

         res.status(200).json(filteredUsers ); // showing users in sidebar
     } catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });     
     }
}

// this below controller is used to get messages(chat) of a particular user
export const getMessages= async (req,res) => {
     try {
         const { id: userToChatId } = req.params; // getting the id of the user to chat as given in message.route.js file
         const myId = req.user._id; // getting my id from req.user._id 
         const messages = await Message.find({ // finding messages(chats) to show when user clicks on a particular user's chat
             $or: [ // this operator is used to perform logical OR operation on an array of two or more expressions and select the documents that satisfy at least one of the expressions
                 { senderId: myId, receiverId: userToChatId }, // either I am sender and other particular user is receiver
                 { senderId: userToChatId, receiverId: myId }, // OR other particular user is sender and I am receiver
             ],
         });
         res.status(200).json(messages ); // showing messages(chats) on frontend
     } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
        
     }
}

// this below controller is used to send messages
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


// this below controller is used to delete message
export const deleteForMe = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id; // Authenticated user's ID

    if (!messageId) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Add userId to deletedBy array if not already present
    if (!message.deletedBy.includes(userId)) {
      message.deletedBy.push(userId);
      await message.save();
    }

    res.status(200).json({ success: true, message: "Message deleted for you" });
  } catch (error) {
    console.error("Error in deleteForMe controller", error.message);
    res.status(500).json({ error: "Failed to delete message for user" });
  }
};

// this below controller is used to delete message for everyone
export const deleteMessageForEveryone = async (req, res) => {
  const { messageId } = req.params; // getting messageId from req.params
    try {
        const message = await Message.findById(messageId); // finding message by messageId
        if (!message) {
            return res.status(404).json({ error: "Message not found" }); // if message not found then showing error
        }
        // await Message.findByIdAndUpdate(messageId); // deleting message by messageId
        message.isDeletedForEveryone = true; // setting isDeletedForEveryone to true
      await message.save(); // saving the message to database
      io.emit("deleteMessageForEveryone", { messageId });
      
        res.status(200).json({ success: true, message: "Message deleted for everyone" });
    } catch (error) {
        console.log("Error in deleteMessageForEveryone controller", error.message);
        res.status(500).json({ error: "Failed to delete message for everyone" });
        
    }
};

