import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const { sendMessage } = useChatStore();

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

  const handleSendMessage = async () => {
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      toast.error("Gagal mengirim pesan");
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
    <div className="p-4 w-full border-t border-pink-500/30 bg-gray-900">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
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

      <form onSubmit={(e) => e.preventDefault()} className="flex items-end gap-2">
        <div className="flex-1 flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Ketik pesan..."
            className="w-full textarea textarea-bordered bg-gray-800 border-pink-500/30 text-pink-200 placeholder-pink-700 font-mono resize-none min-h-[40px] max-h-32"
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
            <Image size={20} />
          </button>
        </div>
        <button
          type="button"
          className="btn btn-circle bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white"
          onClick={handleSendMessage}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
