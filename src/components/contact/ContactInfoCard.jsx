export default function ContactInfoCard({ icon, label, value, hours }) {
  return (
    <div className="contact-info__card">
      <div className="contact-info__card-icon">{icon}</div>
      <p className="contact-info__card-label">{label}</p>
      <p className="contact-info__card-value">{value}</p>
      <p className="contact-info__card-hours">{hours}</p>
    </div>
  );
}
