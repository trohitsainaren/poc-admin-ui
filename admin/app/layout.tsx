import type { Metadata } from "next";

import "./globals.css";
import { Montserrat } from 'next/font/google';
import { cn } from "./lib/utils";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Generated by create next app",
};
const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
    className={cn('h-full', montserrat.className)}
      >
        {children}
        <Toaster
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast:
                    'bg-light-primary dark:bg-dark-secondary dark:text-white/70 text-black-70 rounded-lg p-4 flex flex-row items-center space-x-2',
                },
              }}
            />
      </body>
    </html>
  );
}
