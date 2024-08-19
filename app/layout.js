import { Faustina } from "next/font/google";
import "./globals.css";
import connectDb from "@/utils/database";
import { Toaster } from "react-hot-toast";

import AuthProvider from "@/providers/AuthProvider";

import Nav from "@/components/ui/Navbar/Nav";

connectDb();
const faustina = Faustina({
  subsets: ["latin"],
  weight: ["300", "300", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Chell-PhotoStock",
  description: "Image for you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />

      </head>
      <body className={faustina.className}>
        <AuthProvider>
          <Nav />
          <main>{children}</main>
          <Toaster position="top center" />
        </AuthProvider>
      </body>
    </html>
  );
}
