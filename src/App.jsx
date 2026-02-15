//import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
//mport SettingsPage from "./pages/SettingsPage";
//mport ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import ProtocolBootLoader from "./components/BootLoader";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, []);


  return (
    <div data-theme={theme}>
      {isCheckingAuth && (
          <div className="flex items-center justify-center h-screen">
      <h3 className="text-bold text-red-500 text-4xl">loading yeey</h3>
        <Loader className="size-10 animate-spin" />
      </div>
      )}

      <Routes>
        <Route path="/" element={<ProtocolBootLoader/>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/home" />} />
        
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;

