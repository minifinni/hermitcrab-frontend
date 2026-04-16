import Image from "next/image";
import { domainSprite, domainLabel } from "@/lib/api";

interface HermitSpriteProps {
  domain: string;
  size?: number;
  className?: string;
}

export default function HermitSprite({ domain, size = 40, className = "" }: HermitSpriteProps) {
  return (
    <Image
      src={domainSprite(domain)}
      alt={domainLabel(domain)}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "pixelated" }}
      unoptimized
    />
  );
}
