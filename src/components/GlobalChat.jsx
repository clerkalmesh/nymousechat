import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Send, Image, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const GlobalChat = ({ onBack }) => {
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
      toast.error("Pilih file gambar yang valid");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
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
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      {/* Header Global Chat dengan tombol back */}
      <div className="p-3 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50 flex items-center gap-2">
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm btn-circle text-pink-300 hover:bg-pink-500/20"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h3 className="font-semibold text-center text-pink-300">🌍 Global Chat</h3>
          <p className="text-xs text-center text-purple-300/70">Semua Anonymous online di sini</p>
        </div>
        <div className="w-8" />
      </div>

      {/* Daftar Pesan Global */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {globalMessages.map((msg) => {
          const isOwn = msg.senderId === authUser?._id;
          return (
            <div key={msg._id} className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <div className="size-8 rounded-full border border-pink-500/50">
                  <img
                    src={
                      isOwn
                        ? authUser?.profilePic || "/avatar.png"
                        : msg.senderProfilePic || "/avatar.png"
                    }
                    alt="avatar"
                  />
                </div>
              </div>
              <div className="chat-header text-xs text-pink-400/50 flex items-center gap-1 flex-wrap">
                <span className="font-mono">{msg.senderName || "Anonymous"}</span>
                <span>•</span>
                <span className="font-mono">{msg.senderAnonymousId || "??????"}</span>
                <span>•</span>
                <time>{formatMessageTime(msg.createdAt)}</time>
              </div>
              <div
                className={`chat-bubble ${
                  isOwn ? "bg-cyan-600 text-white" : "bg-pink-600 text-white"
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
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-pink-500/30 bg-gray-900 flex flex-col gap-2">
        {imagePreview && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-pink-500"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center"
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
            className="input input-bordered flex-1 bg-gray-800 border-pink-500/30 text-pink-200 placeholder-pink-700 font-mono"
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
            className={`btn btn-circle ${imagePreview ? "text-pink-400" : "text-purple-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={18} />
          </button>
          <button
            type="submit"
            className="btn btn-circle bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white"
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
