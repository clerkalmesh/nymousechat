import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

const GlobalChat = () => {
  const { globalMessages, getGlobalMessages, sendGlobalMessage, subscribeToGlobal, unsubscribeFromGlobal } =
    useChatStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    getGlobalMessages();
    subscribeToGlobal();
    return () => unsubscribeFromGlobal();
  }, [getGlobalMessages, subscribeToGlobal, unsubscribeFromGlobal]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await sendGlobalMessage({ text: text.trim() });
      setText("");
    } catch (error) {
      toast.error("Gagal mengirim pesan global");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-3 border-b border-base-300 bg-base-100">
        <h3 className="font-semibold text-center">🌍 Global Chat</h3>
        <p className="text-xs text-center text-base-content/50">Semua user online di sini</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {globalMessages.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${msg.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-header text-xs opacity-70">
              {msg.senderName} • {formatMessageTime(msg.createdAt)}
            </div>
            <div className="chat-bubble chat-bubble-secondary">{msg.text}</div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-base-300 bg-base-100 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik pesan global..."
          className="input input-bordered flex-1 input-sm sm:input-md"
        />
        <button type="submit" className="btn btn-primary btn-sm sm:btn-md" disabled={!text.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default GlobalChat;
