function Card({ children, className = '', ...restProps }) {
  return (
    <div
      {...restProps}
      className={`bg-med-card border border-med-border rounded-xl shadow-xs p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
