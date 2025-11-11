import './global.css';
import { ReactNode } from 'react';
import { Providers } from './providers';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


