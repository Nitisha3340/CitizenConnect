
import "./globals.css";
import { IssueProvider } from "@/context/IssueContext";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
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
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}