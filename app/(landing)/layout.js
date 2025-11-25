import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function LandingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
