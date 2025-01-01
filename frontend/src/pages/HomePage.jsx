import React from "react";
import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, users, isUserLoading, getUsers } = useChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar /> {/* Sidebar component is shown on homepage*/}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}{" "}
            {/* If no user is selected then NoChatSelected component is shown else ChatContainer component in which chat between the person and user is shown*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
