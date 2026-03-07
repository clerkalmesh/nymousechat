import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import NoChatSelected from "../components/NoChatSelected";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import AudioControls from "../components/AudioControls";

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
        {/* Header yang menyatu dengan chat */}
        <div className="bg-gray-900/80 backdrop-blur-sm border-b border-pink-500/30 px-4 py-2 flex items-center justify-between lg:justify-end">
          {/* Tombol menu untuk mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden btn btn-circle btn-sm bg-purple-900/50 border-purple-500 text-purple-300 hover:bg-purple-800/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Profil dan kontrol di kanan (desktop) */}
          <div className="flex items-center gap-3">
            {/* Audio Controls - muncul di semua mode */}
            <AudioControls />
            
            {/* Link ke profil */}
            <button
              onClick={() => window.location.href = '/profile'}
              className="btn btn-circle btn-sm bg-purple-900/50 border-purple-500 text-purple-300 hover:bg-purple-800/70"
              title="Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>

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