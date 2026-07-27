export function WhatsappIcon({ size = 16, className }: { size?: number; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- tiny inline brand icon, next/image overhead isn't warranted here
  return <img src="/whatsapp.png" alt="" width={size} height={size} className={className} />;
}
