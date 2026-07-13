import HeroBanner from "@/Components/Banner/HeroBanner";
import CommunityImpact from "@/Components/CommunityImpect/CommunityImpect";
import MarqueeSlider from "@/Components/CompanySilder/CompanySilder";
import FeaturesSection from "@/Components/FeautreSection/FeautreSection";


export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroBanner></HeroBanner>
      <MarqueeSlider></MarqueeSlider>
      <CommunityImpact></CommunityImpact>
      <FeaturesSection></FeaturesSection>
    </main>
  );
}
