interface OverlayProps {
  isOpen: boolean;
  onClick: () => void;
}

const Overlay = ({ isOpen, onClick }: OverlayProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
      onClick={onClick}
    />
  );
};

export default Overlay;

