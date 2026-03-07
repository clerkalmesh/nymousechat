import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime, formatMessageDate } from "../lib/utils";
import { Send, Image, X, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

const GlobalChat = ({ setSidebarOpen }) => {
  const { globalMessages, getGlobalMessages, sendGlobalMessage, subscribeToGlobal, unsubscribeFromGlobal } =
    useChatStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
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

  const handleSend = async () => {
    if (!text.trim() && !imagePreview) return;
    try {
      await sendGlobalMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      toast.error("Gagal mengirim pesan global");
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Kelompokkan pesan berdasarkan tanggal
  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;
    globalMessages.forEach((msg) => {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ type: "date", date: msg.createdAt });
      }
      groups.push({ type: "message", message: msg });
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      {/* Header Global Chat */}
      <div className="p-3 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50 flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden btn btn-ghost btn-sm btn-circle text-pink-300 hover:bg-pink-500/20"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <h3 className="font-semibold text-pink-300">🌍 Global Chat</h3>
          <p className="text-xs text-purple-300/70">Semua Anonymous online di sini</p>
        </div>
      </div>

      {/* Daftar Pesan Global */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupedMessages.map((item, index) => {
          if (item.type === "date") {
            return (
              <div key={`date-${index}`} className="flex justify-center my-2">
                <div className="bg-gray-800 text-pink-300 text-xs px-3 py-1 rounded-full border border-pink-500/30 font-mono">
                  {formatMessageDate(item.date)}
                </div>
              </div>
            );
          }

          const msg = item.message;
          const isOwn = msg.senderId === authUser?._id;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar untuk pesan orang lain */}
              {!isOwn && (
                <div className="flex-shrink-0">
                  <div className="size-8 rounded-full border border-pink-500/50 overflow-hidden">
                    <img
                      src={msg.senderProfilePic || "/avatar.png"}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className={`flex flex-col max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                {/* Nama pengirim untuk pesan orang lain */}
                {!isOwn && (
                  <span className="text-xs text-pink-400 mb-1 font-mono ml-1">
                    {msg.senderName || "Anonymous"} • {msg.senderAnonymousId}
                  </span>
                )}
                {/* Bubble pesan */}
                <div
                  className={`
                    rounded-2xl px-4 py-2 break-words
                    ${
                      isOwn
                        ? "bg-cyan-600 text-white rounded-br-none"
                        : "bg-pink-600 text-white rounded-bl-none"
                    }
                  `}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="attachment"
                      className="max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {msg.text && <p className="text-sm">{msg.text}</p>}
                  <div className={`text-[10px] mt-1 ${isOwn ? "text-cyan-200" : "text-pink-200"} text-right`}>
                    {formatMessageTime(msg.createdAt)}
                  </div>
                </div>
              </div>

              {/* Spacer untuk menjaga layout saat pesan sendiri (tanpa avatar) */}
              {isOwn && <div className="w-8" />}
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => e.preventDefault()} className="p-3 border-t border-pink-500/30 bg-gray-900 flex flex-col gap-2">
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
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Ketik pesan global..."
            className="textarea textarea-bordered flex-1 bg-gray-800 border-pink-500/30 text-pink-200 placeholder-pink-700 font-mono resize-none min-h-[40px] max-h-32"
            rows={1}
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
            type="button"
            className="btn btn-circle bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white"
            onClick={handleSend}
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
