import { X } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="p-3 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="size-10 rounded-full border border-pink-500/50">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.displayName}
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-pink-300">{selectedUser.anonymousId}</h3>
          <p className="text-sm text-purple-300/70">{selectedUser.displayName}</p>
          <p className="text-xs text-pink-400/50">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <button
        onClick={() => setSelectedUser(null)}
        className="btn btn-ghost btn-sm btn-circle text-pink-300 hover:bg-pink-500/20"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ChatHeader;