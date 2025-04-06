import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
const tennisProducts = [
  { id: 1, name: "Tennis Racket", price: 89.99, image: "/assets/tennis-racket.jpg" },
  { id: 2, name: "Tennis Ball", price: 9.99, image: "/assets/tennis-ball.jpg" },
  { id: 3, name: "Tennis Shoes", price: 79.99, image: "/assets/tennis-shoes.jpg" },
  { id: 4, name: "Tennis Racket", price: 89.99, image: "/assets/tennis-racket.jpg" },
  { id: 5, name: "Tennis Ball", price: 9.99, image: "/assets/tennis-ball.jpg" },
  { id: 6, name: "Tennis Shoes", price: 79.99, image: "/assets/tennis-shoes.jpg" }
];

const TennisProduct = () => {
  return (
    <div>
      <Navbar />
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Tennis Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tennisProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default TennisProduct;
