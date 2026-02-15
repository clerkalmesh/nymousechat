import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import GlobalChat from "./GlobalChat";

const ChatContainer = () => {
  const [mode, setMode] = useState("private"); // "private" atau "global"
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (mode === "private" && selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
    };
  }, [mode, selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (mode === "private" && messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, mode]);

  if (mode === "global") {
    return <GlobalChat />;
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-base-content/50">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">💬 Pilih Kontak</h3>
          <p>Atau coba fitur Global Chat</p>
          <button onClick={() => setMode("global")} className="btn btn-primary btn-sm mt-4">
            Buka Global Chat
          </button>
        </div>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Tab selector */}
      <div className="tabs tabs-boxed justify-center p-1 bg-base-200 mx-2 mt-2 rounded-lg">
        <button
          className={`tab tab-sm ${mode === "private" ? "tab-active" : ""}`}
          onClick={() => setMode("private")}
        >
          Private
        </button>
        <button
          className={`tab tab-sm ${mode === "global" ? "tab-active" : ""}`}
          onClick={() => setMode("global")}
        >
          Global
        </button>
      </div>

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-8 rounded-full">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="avatar"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble">
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
