export default function Input({ className = "contact-form__input", type = "text", ...props }) {
  return <input className={className} type={type} {...props} />;
}
