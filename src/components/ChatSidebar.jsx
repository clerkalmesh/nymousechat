// components/ChatSidebar.jsx
import { useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import useAuthStore from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Globe, Users, X } from "lucide-react";

const ChatSidebar = ({ 
  isGlobalMode, 
  setIsGlobalMode, 
  mobileOpen, 
  setMobileOpen 
}) => {
  const { users, selectedUser, setSelectedUser, onlineUsers } = useChatStore();
  const { authUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user._id !== authUser?._id && 
    (user.anonymousId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsGlobalMode(false);
    setMobileOpen(false);
  };

  const handleSelectGlobal = () => {
    setIsGlobalMode(true);
    setSelectedUser(null);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-gray-900 border-r border-pink-500/30
        transform transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header Sidebar */}
        <div className="p-4 border-b border-pink-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-pink-300 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Chats
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-pink-300"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400/50" />
            <Input
              placeholder="Cari chat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-800 border-pink-500/30 text-pink-200"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {/* Global Chat */}
          <div
            onClick={handleSelectGlobal}
            className={`
              flex items-center gap-3 p-4 cursor-pointer hover:bg-purple-900/30
              border-b border-pink-500/30 transition-colors
              ${isGlobalMode ? 'bg-purple-900/50' : ''}
            `}
          >
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600">
                <Globe className="h-6 w-6 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-pink-300">🌍 Global Chat</div>
              <div className="text-sm text-purple-300/70 truncate">
                {onlineUsers.length} online
              </div>
            </div>
          </div>

          {/* Private Chats */}
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`
                flex items-center gap-3 p-4 cursor-pointer hover:bg-purple-900/30
                border-b border-pink-500/30 transition-colors
                ${selectedUser?._id === user._id ? 'bg-purple-900/50' : ''}
              `}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.profilePic || "/avatar.png"} />
                  <AvatarFallback>{user.anonymousId?.[0]}</AvatarFallback>
                </Avatar>
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-pink-300 truncate">
                  {user.anonymousId}
                </div>
                <div className="text-sm text-purple-300/70 truncate">
                  {user.displayName || "Anonymous"}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </>
  );
};

export default ChatSidebar;