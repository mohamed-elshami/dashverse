const SidebarFooter = () => {
  return (
    <div className="shrink-0 p-4 border-t border-blue-500">
      <div className="text-blue-200 text-sm text-center">
        <p className="font-semibold">Dashboard v1.0</p>
        <p className="text-xs mt-1 opacity-75">© {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default SidebarFooter;

