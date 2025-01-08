import React from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { User, LogOut, Trash2, Palette } from "lucide-react";
const SettingsPage = () => {
  const { deleteAccount, authUser, logout } = useAuthStore();
  const { theme } = useThemeStore();
  return (
    <div
      data-theme={theme}
      className="h-screen container mx-auto px-4 pt-20 w-full"
    >
      {authUser && (
        <>
          <Link
            to={"/profile"}
            className={`
  btn border-t-neutral-400 gap-2 transition-colors 
    flex items-center justify-center h-20 w-96 p-4 rounded-md
    hover:shadow-lg text-xl m-4
`}
          >
            <User className="size-5" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </>
      )}
      <Link
        to={"/themes"}
        className={`
  btn border-t-neutral-400 gap-2 transition-colors 
    flex items-center justify-center h-20 w-96 p-4 rounded-md
    hover:shadow-lg text-xl m-4
`}
      >
        <Palette size={20} />
        <span className="hidden sm:inline">Themes</span>
      </Link>
      {authUser && (
        <>
          <button
            onClick={() => deleteAccount(authUser._id)}
            className={`
  btn border-t-neutral-400 gap-2 transition-colors 
    flex items-center justify-center h-20 w-96 p-4 rounded-md
    hover:shadow-lg text-xl m-4
`}
          >
            <Trash2 size={20} />
            <span className="hidden sm:inline">Delete Account</span>
          </button>
          <button
            onClick={logout}
            className={`
  btn border-t-neutral-400 gap-2 transition-colors 
    flex items-center justify-center h-20 w-96 p-4 rounded-md
    hover:shadow-lg text-xl m-4
`}
          >
            <LogOut className="size-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </>
      )}
    </div>
  );
};

export default SettingsPage;
