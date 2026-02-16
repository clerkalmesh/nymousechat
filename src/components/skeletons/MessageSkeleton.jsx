const MessageSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`chat ${i % 2 === 0 ? "chat-start" : "chat-end"}`}>
          <div className="chat-image avatar">
            <div className="size-8 rounded-full bg-gray-700 animate-pulse" />
          </div>
          <div className="chat-header">
            <div className="h-3 w-16 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="chat-bubble bg-gray-700 h-12 w-48 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;