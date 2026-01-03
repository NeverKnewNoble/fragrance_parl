import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { NewArrivals } from '@/components/home/NewArrivals';
import { Browse } from '@/components/home/Browse';
import { Footer } from '@/components/home/Footer';

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <NewArrivals />
      <Browse />
      <Footer />
    </div>
  );
}



