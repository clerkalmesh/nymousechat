import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Send, Image, X } from "lucide-react";
import toast from "react-hot-toast";

const GlobalChat = () => {
  const { globalMessages, getGlobalMessages, sendGlobalMessage, subscribeToGlobal, unsubscribeFromGlobal } =
    useChatStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    getGlobalMessages();
    subscribeToGlobal();
    return () => unsubscribeFromGlobal();
  }, [getGlobalMessages, subscribeToGlobal, unsubscribeFromGlobal]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendGlobalMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
            <div
              className={`chat-bubble ${
                msg.senderId === authUser?._id ? "chat-bubble-primary" : "chat-bubble-secondary"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="attachment"
                  className="max-w-[200px] rounded-md mb-2"
                />
              )}
              {msg.text && <p className="break-words">{msg.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-base-300 bg-base-100 flex flex-col gap-2">
        {imagePreview && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ketik pesan global..."
            className="input input-bordered flex-1 input-sm sm:input-md"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`btn btn-circle btn-sm ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={18} />
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm btn-circle"
            disabled={!text.trim() && !imagePreview}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default GlobalChat;
