export default function ContactInfoCard({
  action,
  badge,
  description,
  disabled = false,
  external = false,
  href,
  icon,
  label,
  value,
  hours,
}) {
  const Component = href ? "a" : "div";
  const className = `contact-info__card${disabled ? " contact-info__card--disabled" : ""}`;

  return (
    <Component
      className={className}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-disabled={disabled || undefined}
    >
      <div className="contact-info__card-icon">{icon}</div>
      <div className="contact-info__card-content">
        <div className="contact-info__card-heading">
          <p className="contact-info__card-label">{label}</p>
          {badge && <span className="contact-info__card-badge">{badge}</span>}
        </div>
        <p className="contact-info__card-value">{value}</p>
        {description && <p className="contact-info__card-description">{description}</p>}
        {hours && <p className="contact-info__card-hours">{hours}</p>}
        {action && <span className="contact-info__card-action">{action}</span>}
      </div>
    </Component>
  );
}
