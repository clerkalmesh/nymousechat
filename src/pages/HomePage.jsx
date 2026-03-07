// pages/HomePage.jsx
import { useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import MessageInput from "@/components/MessageInput";
import NoChatSelected from "@/components/NoChatSelected";
import { useChatStore } from "@/store/useChatStore";
import useAuthStore from "@/store/useAuthStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatMessageTime } from "@/lib/utils";

const HomePage = () => {
  const [isGlobalMode, setIsGlobalMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { messages, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header dengan judul aja (TANPA AUDIO) */}
      <header className="h-14 px-4 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-lg font-bold text-pink-300">Memesh</h1>
        </div>
        {/* KOSONG - ga ada audio di sini */}
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar 
          isGlobalMode={isGlobalMode}
          setIsGlobalMode={setIsGlobalMode}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-gray-900">
          <ChatHeader 
            onMenuClick={() => setMobileOpen(true)}
            isGlobal={isGlobalMode}
          />

          {(!selectedUser && !isGlobalMode) ? (
            <NoChatSelected />  {/* AudioControls ada di sini! */}
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === authUser?._id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={isOwn ? authUser?.profilePic : selectedUser?.profilePic} />
                            <AvatarFallback>?</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className={`rounded-lg p-3 ${
                              isOwn ? 'bg-cyan-600' : 'bg-pink-600'
                            }`}>
                              {message.image && (
                                <img 
                                  src={message.image} 
                                  alt="attachment" 
                                  className="max-w-[200px] rounded mb-2"
                                />
                              )}
                              {message.text && <p>{message.text}</p>}
                            </div>
                            <p className="text-xs text-pink-400/50 mt-1">
                              {formatMessageTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <MessageInput />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;