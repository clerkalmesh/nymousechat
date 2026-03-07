// components/ChatHeader.jsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, MoreVertical } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import useAuthStore from "@/store/useAuthStore";

const ChatHeader = ({ onMenuClick, isGlobal }) => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  
  if (isGlobal) {
    return (
      <div className="h-16 px-4 border-b border-pink-500/30 flex items-center justify-between bg-gray-900">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-pink-300"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600">
              🌍
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-pink-300">Global Chat</h3>
            <p className="text-xs text-purple-300/70">
              {onlineUsers.length} participants
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-pink-300">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="h-16 px-4 border-b border-pink-500/30 flex items-center justify-between bg-gray-900">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-pink-300"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedUser.profilePic || "/avatar.png"} />
            <AvatarFallback>{selectedUser.anonymousId?.[0]}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full ring-2 ring-gray-900" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-pink-300">{selectedUser.anonymousId}</h3>
          <p className="text-xs text-purple-300/70">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="text-pink-300">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;