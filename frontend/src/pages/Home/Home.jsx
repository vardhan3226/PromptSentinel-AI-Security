import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import Statistics from "../../components/home/Statistics";
import Features from "../../components/home/Features";
import HowItWorks from "../../components/home/HowItWorks";
import PromptDemo from "../../components/home/PromptDemo";
import Technology from "../../components/home/Technology";
import Footer from "../../components/layout/Footer";

function Home() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar />
      <Hero />
      <Statistics />
      <Features />
      <HowItWorks />
      <PromptDemo />
      <Technology />
      <Footer />
    </div>
  );
}

export default Home;