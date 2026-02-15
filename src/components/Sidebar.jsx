import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, X, Globe } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, setMode, mode } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    if (window.innerWidth < 1024) setIsMobileOpen(false);
  };

  const handleSelectGlobal = () => {
    setMode("global");
    setSelectedUser(null);
    if (window.innerWidth < 1024) setIsMobileOpen(false);
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-circle btn-sm bg-base-200"
      >
        <Users size={20} />
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          h-full bg-base-100 border-r border-base-300 flex flex-col transition-all duration-300
          fixed lg:relative z-50 w-72
          ${isMobileOpen ? "left-0" : "-left-72 lg:left-0"}
        `}
      >
        <div className="border-b border-base-300 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="size-5" />
              <span className="font-semibold">Chats</span>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden">
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Cari anonymous ID atau nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-sm w-full pl-9"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-xs"
              />
              <span>Online only</span>
            </label>
            <span className="text-xs text-base-content/50">
              {onlineUsers.length - 1} online
            </span>
          </div>
        </div>

        {/* Global Chat Item */}
        <button
          onClick={handleSelectGlobal}
          className={`
            w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors border-b border-base-200
            ${mode === "global" ? "bg-base-200 ring-1 ring-primary" : ""}
          `}
        >
          <div className="relative flex-shrink-0">
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Globe className="size-6 text-primary" />
            </div>
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-medium">🌍 Global Chat</div>
            <div className="text-sm text-base-content/70">Semua user online</div>
          </div>
        </button>

        <div className="flex-1 overflow-y-auto py-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-base-content/50 py-8">Tidak ada kontak</div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`
                  w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors
                  ${selectedUser?._id === user._id ? "bg-base-200 ring-1 ring-primary" : ""}
                `}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.displayName}
                    className="size-12 rounded-full object-cover"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium truncate">{user.anonymousId}</div>
                  <div className="text-sm text-base-content/70 truncate">{user.displayName}</div>
                  <div className="text-xs text-base-content/50">
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
