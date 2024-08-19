// pages/AllProduct.jsx
import { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import ProductList from "../components/ProductList";
import axios from "axios";
const apiurl = import.meta.env.VITE_API_URL;

const AllProduct = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [products, setProducts] = useState([]);

  const getProduct = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleProductUploaded = () => {
    getProduct(); // Refresh the product list
  };

  return (
    <div>
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h2 className="font-bold text-xl text-gray-800">All Products</h2>
        <button
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-1 px-4 rounded-full transition-all"
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          onProductUploaded={handleProductUploaded} // Pass the handler
        />
      )}

      <ProductList
        products={products}
        onProductUploaded={handleProductUploaded}
      />
    </div>
  );
};

export default AllProduct;
