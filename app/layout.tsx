
import "./globals.css";
import { IssueProvider } from "@/context/IssueContext";
import { AuthProvider } from "@/context/AuthContext";

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
        <AuthProvider>
          <IssueProvider>
            {children}
          </IssueProvider>
        </AuthProvider>
      </body>
    </html>
  );
}