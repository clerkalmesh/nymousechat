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
  const textareaRef = useRef(null);

  useEffect(() => {
    getGlobalMessages();
    subscribeToGlobal();
    return () => unsubscribeFromGlobal();
  }, [getGlobalMessages, subscribeToGlobal, unsubscribeFromGlobal]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await sendGlobalMessage({ text: text.trim() });
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      toast.error("Gagal mengirim pesan global");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-base-100">
      <div className="p-3 border-b border-base-300 bg-base-100 flex items-center gap-2">
        <div className="avatar">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-lg">🌍</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Global Chat</h3>
          <p className="text-xs text-base-content/50">Semua user online di sini</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {globalMessages.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${msg.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-8 rounded-full">
                {msg.senderId === authUser?._id ? (
                  <img src={authUser.profilePic || "/avatar.png"} alt="avatar" />
                ) : (
                  <div className="bg-primary/20 size-8 rounded-full flex items-center justify-center">
                    <span className="text-xs">{msg.senderName?.charAt(0) || "?"}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="chat-header text-xs opacity-70">
              {msg.senderName} • {formatMessageTime(msg.createdAt)}
            </div>
            <div className="chat-bubble chat-bubble-secondary">{msg.text}</div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-base-300 bg-base-100 flex items-end gap-2"
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan global..."
          className="textarea textarea-bordered flex-1 py-2 px-3 min-h-[40px] max-h-32 resize-none"
          rows={1}
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={!text.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default GlobalChat;
