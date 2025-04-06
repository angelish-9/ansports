import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import football1 from "../assets/football1.webp";
import football2 from "../assets/football2.avif";
import football3 from "../assets/football3.jpg";


const footballProducts = [
  { id: 1, name: "Football Shoes", price: 49.99, image: football2 },
  { id: 2, name: "Jersey", price: 29.99, image: football3},
  { id: 3, name: "Football", price: 19.99, image: football1},
  { id: 4, name: "Football Shoes", price: 49.99, image: football2 },
  { id: 5, name: "Jersey", price: 29.99, image: football3},
  { id: 6, name: "Football", price: 19.99, image: football1}
];

const FootballProduct = () => {
  return (
    <div><Navbar />
    <div className="container mx-auto p-6">

      <h1 className="text-2xl font-bold text-center mb-6">Football Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {footballProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default FootballProduct;
