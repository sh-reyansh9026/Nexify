// zustand is a global state management library
// that allows you to share state between React components.
// It is a simple and fast alternative to Redux.
// in every page we require state i.e in signup home login etc
// so we use zustand in which we create a store or seperate file for state and then we use it in our pages

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    // it is the initial state of the store
    authUser: null,// initially we do not know user is authenticate dor not so we set it to null
    isSigningUp: false,// initially user is not signed in so we set it to false
    isLoggingIn: false,// initially user is not logged in so we set it to false
    isUpdatingProfile: false,// initially user is not updating profile so we set it to false    
    isCheckingAuth: true,// loading state checking if user is authenticated or not
  // we are using a function to set the state
    
  onlineUsers: [],// initially no user is online so we set it to empty array
  socket: null,// initially socket is null

    checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket(); // Connect to the WebSocket server as soon as we are checking auth
      
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

    // The function is async because it performs an API call (await axiosInstance.post(...)) which is asynchronous.
    // It uses axiosInstance to send a POST request to the backend for user signup.
    // It manages UI states (e.g., isSigningUp) and provides feedback using toast notifications.
    signup: async (data) => {
        set({ isSigningUp: true });//This sets a state variable isSigningUp to true, likely used to show a loading indicator while the signup process is happening.
          // set is a function (likely from Zustand or similar state management library) to update the state.
        try {
            const res = await axiosInstance.post("/auth/signup", data); // Sends a POST request to the /auth/signup endpoint on your server.
            //data is the user-provided signup data (e.g., username, email, password).
            //The server processes the request and returns a response (res).
            set({ authUser: res.data });//Updates the state to store the authenticated user's details from the server response (res.data).
          toast.success("Account created successfully");
          
          get().connectSocket(); // Connect to the WebSocket server as soon as we are signing up
            
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
  },
    
    login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket(); // Connect to the WebSocket server as soon as we are logging in
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket(); // Disconnect from the WebSocket server as soon as we are logging out
        } catch (error) {
            toast.error(error.response.data.message);
        }
  },
    
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
    
  connectSocket: () => {
    const { authUser } = get(); // Get the current state or current authenticated users

    if (!authUser || get().socket?.connected) return; // If there is no authenticated user or the socket is already connected then there is no need to connect from socket as we have no user or already connected in case of connected

    // if there is an authenticated user and the socket is not connected then we connect the socket 
    const socket = io(BASE_URL, { // BASE_URL is the URL of the WebSocket server defined abve
      query: {
        userId: authUser._id,// query.userId = authUser.id is passed to the server to identify the user for getting online user
      }
    }); 
    socket.connect(); // Connect to the WebSocket server

    set({ socket: socket }); // Update the state to store the socket instance

    // after connection to socket we listen for the getOnlineUsers event from the server to get the online users
    socket.on("getOnlineUsers", (userIds) => { // Listen for the getOnlineUsers event from the server
      set({ onlineUsers: userIds }); // Update the state to store the online users
    });

   },

  disconnectSocket: () => { 
    if (get().socket?.connected) get().socket.disconnect(); // If the socket is connected then we disconnect the socket on logout as it is called in logout function
       // Disconnect from the WebSocket server
  },

  deleteAccount: async (userId) => {
    try {
      await axiosInstance.delete(`/auth/deleteAccount/${userId}`);             
      toast.success("Account deleted successfully");
      set({ authUser: null });

    } catch (error) {
      console.log("error in deleteAccount:", error);
      toast.error(error.response.data.message);
    }
  }

}));


