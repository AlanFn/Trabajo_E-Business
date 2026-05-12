export default function Button({ className, type = "button", children, ...props }) {
  return (
    <button className={className} type={type} {...props}>
      {children}
    </button>
  );
}
