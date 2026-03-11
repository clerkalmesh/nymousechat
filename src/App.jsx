// App.jsx (update routes)
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useAudioStore } from "./store/useAudioStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

// Pages
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import GlobalChatPage from "./pages/GlobalChatPage";
import ChatPage from "./pages/ChatPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const { initAudio } = useAudioStore();

  useEffect(() => {
    initAudio("/auth.mp3");
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        
        {/* New routes for chat pages */}
        <Route path="/global" element={authUser ? <GlobalChatPage /> : <Navigate to="/login" />} />
        <Route path="/chat/:userId" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;