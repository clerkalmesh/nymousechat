// pages/ChatPage.jsx
import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "../components/skeletons/MessageSkeleton";

const ChatPage = () => {
  const { userId } = useParams();
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    setSelectedUser,
    users,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Cari user berdasarkan ID dari URL
  useEffect(() => {
    if (userId && users.length > 0) {
      const user = users.find(u => u._id === userId);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [userId, users, setSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
      setSelectedUser(null);
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages, setSelectedUser]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) {
    return <Navigate to="/" />;
  }

  if (isMessagesLoading) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50 flex items-center gap-3">
          <Link
            to="/"
            className="btn btn-ghost btn-sm btn-circle text-pink-300 hover:bg-pink-500/20"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="size-10 rounded-full border border-pink-500/50">
                <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.displayName} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-pink-300">{selectedUser.anonymousId}</h3>
              <p className="text-xs text-purple-300/70">{selectedUser.displayName}</p>
            </div>
          </div>
        </div>
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50 flex items-center gap-3">
        <Link
          to="/"
          className="btn btn-ghost btn-sm btn-circle text-pink-300 hover:bg-pink-500/20"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full border border-pink-500/50">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.displayName} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-pink-300">{selectedUser.anonymousId}</h3>
            <p className="text-xs text-purple-300/70">{selectedUser.displayName}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-8 rounded-full border border-pink-500/50">
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
              <time className="text-xs text-pink-400/50">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`chat-bubble ${
                message.senderId === authUser._id
                  ? "bg-cyan-600 text-white"
                  : "bg-pink-600 text-white"
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p className="break-words">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatPage;