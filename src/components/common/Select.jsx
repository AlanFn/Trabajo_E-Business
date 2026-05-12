export default function Select({ className, id, options, children, ...props }) {
  return (
    <select className={className} id={id} {...props}>
      {options
        ? options.map((option) => (
            <option value={option.id || option} key={option.id || option}>
              {option.label || option}
            </option>
          ))
        : children}
    </select>
  );
}
