interface PriceBadgeProps {
  price: string;
  priceType: "free" | "paid" | "rental";
}

export default function PriceBadge({ price, priceType }: PriceBadgeProps) {
  const styles = {
    free: "bg-emerald-900/60 text-emerald-400 border-emerald-700",
    paid: "bg-amber-900/60 text-amber-400 border-amber-700",
    rental: "bg-orange-900/60 text-orange-400 border-orange-700",
  };

  return (
    <span
      className={`text-[9px] font-pixel px-2 py-1 border rounded-none ${styles[priceType]}`}
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      {price}
    </span>
  );
}
