import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [isGlobalMode, setIsGlobalMode] = useState(false);

  return (
    <div className="h-screen bg-gray-900">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-gray-800/80 border border-pink-500/40 rounded-xl shadow-2xl shadow-pink-500/30 w-full max-w-6xl h-[calc(100vh-8rem)] backdrop-blur-sm">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar 
              isGlobalMode={isGlobalMode} 
              setIsGlobalMode={setIsGlobalMode} 
            />
            {isGlobalMode ? (
              <ChatContainer isGlobalMode={true} />
            ) : !selectedUser ? (
              <NoChatSelected />
            ) : (
              <ChatContainer isGlobalMode={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;