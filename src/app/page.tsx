import HeroBanner from "@/Components/Banner/HeroBanner";
import CommunityImpact from "@/Components/CommunityImpect/CommunityImpect";
import MarqueeSlider from "@/Components/CompanySilder/CompanySilder";
import ContactSection from "@/Components/contactUs/ContactUs";
import FaqSection from "@/Components/FAQ/FAQ";
import FeaturesSection from "@/Components/FeautreSection/FeautreSection";
import Momentsofhope from "@/Components/MomentofHope/MomentOfHope";
import StrongBuildSection from "@/Components/StrongForCommunity/StrongForCommunity";


export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroBanner></HeroBanner>
      <MarqueeSlider></MarqueeSlider>
      <CommunityImpact></CommunityImpact>
      <FeaturesSection></FeaturesSection>
      <StrongBuildSection></StrongBuildSection>
      <Momentsofhope></Momentsofhope>
      <ContactSection></ContactSection>
      <FaqSection></FaqSection>
    </main>
  );
}
