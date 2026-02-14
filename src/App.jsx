import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProtocolBootLoader from "./components/BootLoader";
import { audioManager } from "./lib/audioManager";

import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  
  useEffect(() => {
    audioManager.load("boot", "/auth.mp3", 1);
    audioManager.load("auth", "/auth.mp3", 1);
    //audioManager.load("enter", "/sounds/enter.mp3", 1);
  }, []);


  useEffect(() => {
    checkAuth();
  }, []);

  // ✅ Boot hanya tampil selama auth check berjalan
  if (isCheckingAuth) {
    return <ProtocolBootLoader />;
  }

  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUpPage /> } />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
