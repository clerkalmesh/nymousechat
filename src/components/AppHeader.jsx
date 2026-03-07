// components/AppHeader.jsx
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { Link } from "react-router-dom";

const AppHeader = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-gray-900 border-b border-pink-500/30 h-14 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <h1 className="text-lg font-bold text-pink-300">Memesh</h1>
      </div>

      {authUser && (
        <div className="flex items-center gap-2">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-pink-300">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="text-pink-300"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default AppHeader;