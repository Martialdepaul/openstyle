import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.jpg"
      alt="OPENSTYLE"
      width={1254}
      height={1254}
      priority
      className={`w-auto object-contain ${className ?? ""}`}
    />
  );
}
