import { X } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="p-3 border-b border-base-300 bg-base-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="size-10 rounded-full relative">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.displayName}
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold">{selectedUser.anonymousId}</h3>
          <p className="text-sm text-base-content/70">{selectedUser.displayName}</p>
          <p className="text-xs text-base-content/50">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <button
        onClick={() => setSelectedUser(null)}
        className="btn btn-ghost btn-sm btn-circle"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ChatHeader;
