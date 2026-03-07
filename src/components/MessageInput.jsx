// components/MessageInput.jsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image, X } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Pilih file gambar");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!text.trim() && !imagePreview) return;
    if (!selectedUser) return;

    try {
      await sendMessage({
        receiverId: selectedUser._id,
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Gagal kirim pesan");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-pink-500/30 bg-gray-900">
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img 
            src={imagePreview} 
            alt="preview" 
            className="h-20 w-20 object-cover rounded-lg"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={() => setImagePreview(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <Button
          variant="outline"
          size="icon"
          className="border-pink-500/30 text-pink-300"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="h-5 w-5 text-white" />
        </Button>
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan..."
          className="min-h-[40px] max-h-32 bg-gray-800 border-pink-500/30 text-pink-200"
          rows={1}
        />
        
        <Button
          onClick={handleSend}
          disabled={!text.trim() && !imagePreview}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          <Send className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;