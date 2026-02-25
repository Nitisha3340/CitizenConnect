
import "./globals.css";
import { IssueProvider } from "@/context/IssueContext";
import { AuthProvider } from "@/context/AuthContext";
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
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}