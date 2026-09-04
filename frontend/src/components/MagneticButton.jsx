function MagneticButton({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

export default MagneticButton;