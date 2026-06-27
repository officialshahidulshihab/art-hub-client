import Banner from "@/Components/Banner";
import BrowseByDiscipline from "@/Components/BrowseByDiscipline";
import FeaturedSection from "@/Components/FeaturedSection";
import TopArtistsSection from "@/Components/TopArtistsSection";
import { getBanners } from "@/lib/data";

export default async function Home() {
  const banners = await getBanners();

  return (
    <div>
      <Banner slides={banners} />
      <FeaturedSection></FeaturedSection>
      <TopArtistsSection></TopArtistsSection>
      <BrowseByDiscipline></BrowseByDiscipline>
    </div>
  );
}