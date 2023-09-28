import Banner from "../components/Banner";
import Highlights from "../components/Highlights";
import FeaturedProducts from "../components/FeaturedProducts";

export default function Home() {
  const data = {
    title: "Nyosh Kicks Hub",
    content: "Discover the latest trends in footwear for every occasion.",
    destination: "/courses",
    label: "Shop now!",
  };

  return (
    <>
      <Banner data={data} />
      <FeaturedProducts />
      <Highlights />
    </>
  );
}
