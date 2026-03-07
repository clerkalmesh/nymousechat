import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import NoChatSelected from "../components/NoChatSelected";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
//import AudioControls from "../components/AudioControls";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isGlobalMode, setIsGlobalMode] = useState(false);
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Sidebar - sekarang full height tanpa navbar terpisah */}
      <Sidebar
        isGlobalMode={isGlobalMode}
        setIsGlobalMode={setIsGlobalMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        

        {/* Chat Area atau No Chat Selected */}
        {selectedUser || isGlobalMode ? (
          <ChatArea 
            isGlobalMode={isGlobalMode} 
            setSidebarOpen={setSidebarOpen}
          />
        ) : (
          <NoChatSelected setSidebarOpen={setSidebarOpen} />
        )}
      </div>
    </div>
  );
};

export default HomePage;