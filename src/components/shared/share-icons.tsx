type IconProps = { size?: number };

export function XIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function LinkedInIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5a1.94 1.94 0 1 0 0-3.88 1.94 1.94 0 0 0 0 3.88zM5.5 10.25h2.88V19H5.5v-8.75zM10.75 10.25h2.75v1.2h.04c.38-.72 1.32-1.48 2.71-1.48 2.9 0 3.44 1.9 3.44 4.39V19h-2.88v-4.1c0-.98-.02-2.24-1.37-2.24-1.37 0-1.58 1.07-1.58 2.17V19h-2.88v-8.75z" />
    </svg>
  );
}
