interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
}

export default function StarRating({ rating, max = 5, size = "sm" }: StarRatingProps) {
  const textSize = size === "sm" ? "text-xs" : "text-base";
  return (
    <span className={`${textSize} tracking-tight`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < rating ? "text-amber-400" : "text-gray-600"}>
          ★
        </span>
      ))}
    </span>
  );
}
