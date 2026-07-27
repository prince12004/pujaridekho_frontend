import Image from "next/image";
import { siteConfig } from "@/lib/constants";

export function WhatsappFloatButton() {
  const number = siteConfig.contact.whatsapp.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <Image src="/whatsapp.png" alt="" width={500} height={500} className="h-full w-full" />
    </a>
  );
}
