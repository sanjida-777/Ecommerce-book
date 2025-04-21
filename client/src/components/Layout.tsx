import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <CartSidebar />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
