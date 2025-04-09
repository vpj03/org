import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSlider from '@/components/home/hero-slider';
import PromoSection from '@/components/home/promo-section';
import CategorySlider from '@/components/home/category-slider';
import ProductSection from '@/components/home/product-section';
import BrandSection from '@/components/home/brand-section';
import EbookSection from '@/components/home/ebook-section';
import SubscribeSection from '@/components/home/subscribe-section';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        <HeroSlider />
        <PromoSection />
        <CategorySlider />
        <ProductSection title="OrgPick Vegetables" categoryId={1} />
        <ProductSection title="Orgpick Launch Offer" />
        <ProductSection title="Certified Organic Cold Pressed Oils" categoryId={3} />
        <PromoSection />
        <BrandSection />
        <ProductSection title="Premium Organic Dry Fruits" categoryId={4} />
        <EbookSection />
        <SubscribeSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
