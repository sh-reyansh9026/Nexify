import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => { 
     try {
         const loggedInUser = req.user._id; // checking which users are loggedIn to show in sidebar
         const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password"); // finding all users except the loggedIn user they are not shown in sidebar ne: means not equal to

     } catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });     
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
                    { senderId: userToChatId, receiverId: myId } // OR other particular user is sender and I am receiver
             ]
         })
         res.status(200).json({ messages }); // showing messages(chats) on frontend
     } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
     }
}