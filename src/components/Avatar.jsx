export default function Avatar({ ini, av, className = '' }) {
  return <div className={`avatar ${av} ${className}`}>{ini}</div>;
}
