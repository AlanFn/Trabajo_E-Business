import Input from "./Input";

export default function FormField({ id, label, placeholder, type = "text" }) {
  return (
    <div className="contact-form__group">
      <label className="contact-form__label" htmlFor={id}>
        {label}
      </label>
      <Input id={id} placeholder={placeholder} type={type} />
    </div>
  );
}
