import logoImg from "../assets/attachment1.png";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <img src={logoImg} alt="OPENSTYLE" className={`object-contain ${className}`} />
  );
}
