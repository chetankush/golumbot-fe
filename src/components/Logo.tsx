export function GolumIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="flex-shrink-0">
      {/* Dark circle on light bg, white circle on dark bg */}
      <circle cx="32" cy="32" r="30" className="fill-[#1a1a1a] dark:fill-white" />
      {/* Left eye */}
      <ellipse cx="22" cy="28" rx="7" ry="8" className="fill-white dark:fill-[#1a1a1a]" />
      <circle cx="24" cy="28" r="3.5" className="fill-[#1a1a1a] dark:fill-white" />
      <circle cx="25.5" cy="26" r="1.2" className="fill-white dark:fill-[#1a1a1a]" />
      {/* Right eye */}
      <ellipse cx="42" cy="28" rx="7" ry="8" className="fill-white dark:fill-[#1a1a1a]" />
      <circle cx="44" cy="28" r="3.5" className="fill-[#1a1a1a] dark:fill-white" />
      <circle cx="45.5" cy="26" r="1.2" className="fill-white dark:fill-[#1a1a1a]" />
    </svg>
  );
}
