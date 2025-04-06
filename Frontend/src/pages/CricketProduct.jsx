import Navbar from "../components/Navbar";
import ProductCard from "../components/CategoryCard";
import cricket1 from "../assets/cricket1.jpeg";
import cricket2 from "../assets/cricket2.jpg";
import cricket3 from "../assets/Cricket3.jpg";


const cricketProducts = [
  { id: 1, name: "Cricket Bat", price: 69.99, image: cricket1},
  { id: 2, name: "Cricket Ball", price: 12.99, image: cricket2},
  { id: 3, name: "Cricket Gloves", price: 29.99, image: cricket3},
  { id: 4, name: "Cricket Bat", price: 69.99, image: cricket1},
  { id: 5, name: "Cricket Ball", price: 12.99, image: cricket2},
  { id: 6, name: "Cricket Gloves", price: 29.99, image: cricket3}
];

const CricketProduct = () => {
  return (
    <div>
    <Navbar />
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Cricket Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cricketProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default CricketProduct;
