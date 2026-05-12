export default function FeatureCard({ icon, title, text }) {
  return (
    <div className="inicio-card">
      <div className="inicio-card__icon">{icon}</div>
      <h3 className="inicio-card__title">{title}</h3>
      <p className="inicio-card__text">{text}</p>
    </div>
  );
}
