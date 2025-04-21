import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BookStore - Your Online Bookshop",
  description: "Browse and buy your favorite books online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <CartSidebar />
        </div>
      </body>
    </html>
  );
}