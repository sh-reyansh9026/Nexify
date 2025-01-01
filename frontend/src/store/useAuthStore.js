// zustand is a global state management library
// that allows you to share state between React components.
// It is a simple and fast alternative to Redux.
// in every page we require state i.e in signup home login etc
// so we use zustand in which we create a store or seperate file for state and then we use it in our pages

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
    // it is the initial state of the store
    authUser: null,// initially we do not know user is authenticate dor not so we set it to null
    isSigningUp: false,// initially user is not signed in so we set it to false
    isLoggingIn: false,// initially user is not logged in so we set it to false
    isUpdatingProfile: false,// initially user is not updating profile so we set it to false    

    isCheckingAuth: true,// loading state checking if user is authenticated or not
  // we are using a function to set the state
    
  onlineUsers: [],// initially no user is online so we set it to empty array
    
    checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      
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
      console.log("Error in updateProfile:", error);
      toast.error(error.response.data.message);
      
    } finally {
      set({ isUpdatingProfile: false });
    }
    },
    
  

}));