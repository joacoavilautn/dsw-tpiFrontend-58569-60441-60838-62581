function Modal({
  isOpen = true,
  maxWidth = 'max-w-md',
  className = '',
  children,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        className={`w-full ${maxWidth} max-h-[95vh] overflow-y-auto bg-white border border-med-border rounded-2xl shadow-xl ${className}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
