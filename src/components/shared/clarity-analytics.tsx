"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Microsoft Clarity (session recordings & heatmaps). Production only, and not on
// the admin / CRM panels so staff sessions aren't recorded.
const CLARITY_PROJECT_ID = "zjms24x34u";

export function ClarityAnalytics() {
  const pathname = usePathname() ?? "";
  if (process.env.NODE_ENV !== "production") return null;
  if (/^\/(admin|crm)(\/|$)/.test(pathname)) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
    </Script>
  );
}
