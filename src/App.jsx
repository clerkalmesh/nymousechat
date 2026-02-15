//import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
//mport SettingsPage from "./pages/SettingsPage";
//mport ProfilePage from "./pages/ProfilePage";
import BootWrapper from "./components/BootWrapper";

import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [authUser]);


  return (
    <div data-theme={theme}>
      {isCheckingAuth && (
          <div className="flex items-center justify-center h-screen gap-2">
      <h3 className="text-bold text-red-500 text-4xl">loading yeey</h3>
        <Loader className="size-10 animate-spin" />
      </div>
      )}

      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>} />
        <Route path="/signup" element={<BootWrapper><SignUpPage /></BootWrapper>} />
        <Route path="/login" element={!authUser ? <BootWrapper><LoginPage /> </BootWrapper>: <Navigate to="/" />} />
        
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;

