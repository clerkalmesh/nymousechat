import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [isGlobalMode, setIsGlobalMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-900 pt-16 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isGlobalMode={isGlobalMode}
        setIsGlobalMode={setIsGlobalMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Area Chat Utama */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {isGlobalMode ? (
          <ChatArea isGlobalMode={true} setSidebarOpen={setSidebarOpen} />
        ) : !selectedUser ? (
          <NoChatSelected setSidebarOpen={setSidebarOpen} />
        ) : (
          <ChatArea isGlobalMode={false} setSidebarOpen={setSidebarOpen} />
        )}
      </main>
    </div>
  );
};

export default HomePage;