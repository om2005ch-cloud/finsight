function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse bg-zinc-800/70 rounded-md ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
