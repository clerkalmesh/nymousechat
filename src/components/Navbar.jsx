import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { LogOut, MessageSquare, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-gray-900 border-b border-pink-500/30 fixed w-full top-0 z-50 backdrop-blur-lg bg-gray-900/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-pink-300 font-mono">Memesh</h1>
          </Link>

          {authUser && (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="btn btn-sm bg-purple-900/50 border-pink-500/30 text-pink-300 hover:bg-purple-800/70 gap-2"
              >
                <User className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button
                onClick={logout}
                className="btn btn-sm bg-pink-900/50 border-pink-500/30 text-pink-300 hover:bg-pink-800/70 gap-2"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;