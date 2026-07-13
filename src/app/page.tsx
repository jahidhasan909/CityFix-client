import HeroBanner from "@/Components/Banner/HeroBanner";
import MarqueeSlider from "@/Components/CompanySilder/CompanySilder";


export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroBanner></HeroBanner>
      <MarqueeSlider></MarqueeSlider>
    </main>
  );
}
