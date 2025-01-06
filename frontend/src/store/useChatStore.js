import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    // initial state of the store
  messages: [],
  users: [],
  selectedUser: null, 
  isUsersLoading: false,
  isMessagesLoading: false,

    // functin to get list of users on left hand side of chat and set it to users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

    // function to get messages between two users and set it to messages 
    getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

    // function to select a user from the list of users to chat with or display messages

    // function to send message to the selected user
    sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });// add the new message at the end to the existing messages (...messages)
        } catch (error) {
            toast.error(error.response.data.message);
            
        }
    },

    // this function is used to get the new message from the server and add it to the existing messages
    subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return; // if the new message is not from the selected user then return

          set({
        messages: [...get().messages, newMessage],
      }); // add the new message at the end to the existing messages (...messages)
          
        });
    },

    // this function is used to unsubscribe from the messages when we are not chatting with anyone or we are not on the chat page or we are on some other page or we are logging out
    unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  deleteForMe: async (messageId) => {
  try {
    await axiosInstance.put(`/messages/deleteForMe/${messageId}`);
    set((state) => ({
      messages: state.messages.map((msg) => // state.messages gives the state of all existing state of messags
        msg._id === messageId // if both are not equal then msg is shown as it is without modification
          ? { ...msg, deletedBy: [...msg.deletedBy, useAuthStore.getState().authUser._id] } // otherwise ...msg-> spreads all existing properties of current message and copy them into new object
          : msg
        // deletedBy:[...] updates existing field of matched message
        // msg.deletedBy -> this is existing array of user IDs who have deleted message
        // ...msg.deletedBy -> spreads the existing user IDs into a new array 
        // useAuthStore.getState().authUser._id: Gets the current user's ID from the authentication store.
        // [...msg.deletedBy, useAuthStore.getState().authUser._id]: Adds the current user's ID to the deletedBy array.
      ),
    }));

    toast.success("Message deleted for you");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete message");
  }
},


  deleteForEveryone: async (messageId) => {
    try {
      await axiosInstance.put(`/messages/deleteForEveryone/${messageId}`);
      // set({
      //   messages: getMessages(selectedUser._id).filter((msg) => msg._id !== messageId),
      // });
      toast.success("Message deleted for everyone");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
}));