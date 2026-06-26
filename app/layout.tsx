import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "AI Readiness Assessment",
  description:
    "Assess your organization's AI readiness across six dimensions and get personalized, practical recommendations.",
};

// Applies the persisted theme before first paint so there's no flash of the
// wrong color scheme. Runs only when the user has made an explicit choice;
// otherwise the CSS prefers-color-scheme default takes over.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
