// zustand is a global state management library
// that allows you to share state between React components.
// It is a simple and fast alternative to Redux.
// in every page we require state i.e in signup home login etc
// so we use zustand in which we create a store or seperate file for state and then we use it in our pages

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";


export const useAuthStore = create((set) => ({
    // it is the initial state of the store
    authUser: null,// initially we do not know user is authenticate dor not so we set it to null
    isSigningUp: false,// initially user is not signed in so we set it to false
    isLoggingIn: false,// initially user is not logged in so we set it to false
    isUpdatingProfile: false,// initially user is not updating profile so we set it to false    

    isCheckingAuth: true,// loading state checking if user is authenticated or not
    // we are using a function to set the state
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("auth/check");

            set({ authUser: res.data });

        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
            
        } finally {
            set({ isCheckingAuth: false }); 
        }
    }

}));