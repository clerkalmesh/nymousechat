// pages/HomePage.jsx (simplified)
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import { MessageCircle } from "lucide-react";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-900 flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-full relative">
        <NoChatSelected setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  );
};

export default HomePage;