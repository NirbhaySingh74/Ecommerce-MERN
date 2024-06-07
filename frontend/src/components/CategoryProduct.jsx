import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
const CategoryProduct = () => {
  const { categoryName } = useParams();
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const getProduct = async () => {
    const res = await axios.get(`/api/product-category/${categoryName}`);
    // console.log(res);
    setProduct(res?.data?.data);
    setLoading(false);
  };

  useEffect(() => {
    getProduct();
  }, []);
  console.log(products);
  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{products.category}</h2>
      <div className="flex flex-wrap gap-4">
        {loading
          ? loadingList.map((product, index) => {
              return (
                <div
                  className="w-full sm:w-[calc(20%-16px)] bg-white rounded-sm shadow"
                  key={index}
                >
                  <div className="bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse"></div>
                  <div className="p-4 grid gap-3">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
                    <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2"></p>
                    <div className="flex gap-3">
                      <p className="text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                      <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2"></p>
                    </div>
                    <button className="text-sm text-white px-3 rounded-full bg-slate-200 py-2 animate-pulse"></button>
                  </div>
                </div>
              );
            })
          : products.map((product, index) => {
              return (
                <div
                  to={"product/" + product?._id}
                  className="w-full sm:w-[calc(20%-16px)] bg-white rounded-sm shadow"
                  key={index}
                >
                  <div className="bg-slate-200 h-48 p-4 flex justify-center items-center">
                    <img
                      src={product.images[0]}
                      className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                    />
                  </div>
                  <div className="p-4 grid gap-3">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                      {product?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {product?.category}
                    </p>
                    <div className="flex gap-3">
                      <p className="text-red-600 font-medium">
                        {product?.sellingPrice}
                      </p>
                      <p className="text-slate-500 line-through">
                        {product?.price}
                      </p>
                    </div>
                    <button className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full">
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default CategoryProduct;
