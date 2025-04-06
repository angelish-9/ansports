import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import basketball1 from "../assets/basketball1.png";
import basketball2 from "../assets/basketball2.jpg";
import basketball3 from "../assets/basketball3.jpg";

const basketballProducts = [
  { id: 1, name: "Basketball", price: 24.99, image: basketball1 },
  { id: 2, name: "Basketball Shoes", price: 59.99, image: basketball3 },
  { id: 3, name: "Basketball Jersey", price: 34.99, image: basketball2 },
  { id: 4, name: "Basketball", price: 24.99, image: basketball1 },
  { id: 5, name: "Basketball Shoes", price: 59.99, image: basketball3 },
  { id: 6, name: "Basketball Jersey", price: 34.99, image: basketball2 }
];


const BasketballProduct = () => {
  return (
    <div>
      <Navbar />
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Basketball Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {basketballProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default BasketballProduct;
