import Header from "../../components/common/Header";
import HeroSlider from "../../components/home/HeroSlider";
import MovieSection from "../../components/home/MovieSection";
import PromotionSection from "../../components/home/PromotionSection";
import Footer from "../../components/common/Footer";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSlider />
      <MovieSection />
      <PromotionSection />
      <Footer />
    </>
  );
};

export default HomePage;