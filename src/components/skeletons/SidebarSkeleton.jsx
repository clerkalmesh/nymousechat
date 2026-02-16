const SidebarSkeleton = () => {
  return (
    <aside className="h-full w-72 bg-gray-900 border-r border-pink-500/30 p-4">
      <div className="h-8 bg-gray-800 rounded animate-pulse mb-4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="size-12 bg-gray-800 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;