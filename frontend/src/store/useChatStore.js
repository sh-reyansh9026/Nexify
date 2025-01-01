import { create } from 'zustand';
import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios';



export const useChatStore = create((set,get) => ({
    // initial state of the store
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    // functin to get list of users on left hand side of chat and set it to users
    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
            
        } catch (error) {
            toast.error(error.response.data.message);
            
        } finally {
            set({ isUserLoading: false });
        }
    },

    // function to get messages between two users and set it to messages 
    getMessages: async (userId) => { // userId is the id of the user with whom we want to get messages
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data});
            
        } catch (error) {
            toast.error(error.response.data.message);
            
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // function to select a user from the list of users to chat with or display messages
    // Todo: Optimize this one later
    setSelectedUser: (selectedUser) => set({ selectedUser }),

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

}));