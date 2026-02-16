import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, X, Globe, ChevronLeft } from "lucide-react";

const Sidebar = ({ isGlobalMode, setIsGlobalMode, sidebarOpen, setSidebarOpen }) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users
    .filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true))
    .filter((user) =>
      user.anonymousId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsGlobalMode(false);
    setSidebarOpen(false);
  };

  const handleSelectGlobal = () => {
    setIsGlobalMode(true);
    setSelectedUser(null);
    setSidebarOpen(false);
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-72 bg-gray-900 border-r border-pink-500/30
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="border-b border-pink-500/30 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-pink-400" />
              <span className="font-semibold text-pink-300">Kontak</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-pink-300"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-pink-400/50" />
            <input
              type="text"
              placeholder="Cari anonymous ID atau nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-9 bg-gray-800 border-pink-500/30 text-pink-200 placeholder-pink-700 font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-xs border-pink-500 [--chkbg:theme(colors.pink.500)]"
              />
              <span className="text-purple-300">Hanya online</span>
            </label>
            <span className="text-xs text-pink-400/70">
              {onlineUsers.length - 1} online
            </span>
          </div>
        </div>

        {/* Global Chat Item */}
        <button
          onClick={handleSelectGlobal}
          className={`
            w-full p-3 flex items-center gap-3 hover:bg-purple-900/50 transition-colors border-b border-pink-500/30
            ${isGlobalMode ? "bg-purple-900/70 ring-1 ring-pink-500" : ""}
          `}
        >
          <div className="relative flex-shrink-0">
            <div className="size-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Globe className="size-6 text-white" />
            </div>
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-medium text-pink-300">🌍 Global Chat</div>
            <div className="text-sm text-purple-300/70">Semua user online</div>
          </div>
        </button>

        {/* Daftar User */}
        <div className="flex-1 overflow-y-auto py-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-pink-500/50 py-8 font-mono">Tidak ada kontak</div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`
                  w-full p-3 flex items-center gap-3 hover:bg-purple-900/50 transition-colors
                  ${selectedUser?._id === user._id ? "bg-purple-900/70 ring-1 ring-pink-500" : ""}
                `}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.displayName}
                    className="size-12 rounded-full object-cover border border-pink-500/50"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium truncate text-pink-300">{user.anonymousId}</div>
                  <div className="text-sm text-purple-300/70 truncate">{user.displayName}</div>
                  <div className="text-xs text-pink-400/50">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;