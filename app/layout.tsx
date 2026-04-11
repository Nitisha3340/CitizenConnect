import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";

export const metadata = {
  title: "CitizenConnect",
  description: "Civic Issue Reporting Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-[#0b1120] text-white">
        <Providers>
          {/* Toast Notifications */}
          <Toaster position="top-right" />

          {/* Main App */}
          <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}