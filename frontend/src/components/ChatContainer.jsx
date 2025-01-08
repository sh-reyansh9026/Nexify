import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

// Chat Container has three parts - Header -> where user is shown , Messages-> where chats are shown, and MessageInput-> where user can type messages
const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteForMe,
    deleteForEveryone,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null); // to scroll to the bottom of the chat when new message is sent or received immediately automatically

  useEffect(() => {
    // useEffect is used to get messages between two users and subscribe to messages
    getMessages(selectedUser._id);

    subscribeToMessages(); // subscribe to messages between two users means to show chats between two users in real time

    return () => unsubscribeFromMessages(); // unsubscribe from messages between two users when we are not chatting with anyone or we are not on the chat page or we are on some other page or we are logging out
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // to scroll to the bottom of the chat when new message is sent or received immediately automatically
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // useEffect(() => {
  //   scrollToTop();
  // }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isDeletedForMe = message.deletedBy.includes(authUser._id);
          const isDeletedForEveryone = message.isDeletedForEveryone;

          return (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              {/* Deletion logic */}
              <div className="chat-bubble flex flex-col">
                {isDeletedForEveryone ? (
                  <p className="italic text-gray-500">
                    This message was deleted.
                  </p>
                ) : isDeletedForMe ? (
                  <p className="italic text-gray-500">
                    This message was deleted for you.
                  </p>
                ) : (
                  <>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </>
                )}

                {/* Add delete options */}
                {!isDeletedForMe && !isDeletedForEveryone && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => deleteForMe(message._id)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Delete for Me
                    </button>
                    {authUser._id === message.senderId && (
                      <button
                        onClick={() => deleteForEveryone(message._id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete for Everyone
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
