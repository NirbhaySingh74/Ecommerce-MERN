import axios from "axios";

import { useContext, useEffect, useMemo, useState } from "react";

import Context from "../context";

import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
const apiurl = import.meta.env.VITE_API_URL;

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchUserCart } = useContext(Context);
  const loadingCart = new Array(4).fill(null);

  const fetchData = async () => {
    const res = await axios.get(`${apiurl}/api/view-cart-product`);

    if (res.data.success) {
      setData(res.data.data);
      // console.log(res.data.data);
    }
  };

  const handleLoading = async () => {
    await fetchData();
  };

  useEffect(() => {
    setLoading(true);
    handleLoading();
    setLoading(false);
  }, []);

  const deleteProductCartHandler = async (id) => {
    try {
      const res = await axios.delete(`${apiurl}/api/delete-cart-product`, {
        data: { productId: id }, // Send productId in the request body
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.success === true) {
        toast.success(res.data.message);
        fetchData();
        fetchUserCart();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message);
    }
  };

  const increaseQty = async (id, qty) => {
    try {
      const response = await axios.post(
        `${apiurl}/api/update-cart-product`,
        {
          _id: id,
          quantity: qty + 1,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;
      console.log(responseData);
      if (responseData.success) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty >= 2) {
      try {
        const response = await axios.post(
          `${apiurl}/api/update-cart-product`,
          {
            _id: id,
            quantity: qty - 1,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = response.data;
        // console.log(responseData);
        if (responseData.success) {
          fetchData();
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const totalQuantity = useMemo(() => {
    return data.reduce((total, product) => total + product.quantity, 0);
  }, [data]);

  const totalPrice = useMemo(() => {
    return data.reduce(
      (total, product) =>
        total + product.productId.sellingPrice * product.quantity,
      0
    );
  }, [data]);

  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5">No Data</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
        {/***view product */}
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart?.map((el, index) => {
                return (
                  <div
                    key={el + "Add To Cart Loading" + index}
                    className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                  ></div>
                );
              })
            : data.map((product) => {
                return (
                  <div
                    key={product?._id + "Add To Cart Loading"}
                    className="w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]"
                  >
                    <div className="w-32 h-32 bg-slate-200">
                      <img
                        src={product?.productId?.images[0]}
                        className="w-full h-full object-scale-down mix-blend-multiply"
                      />
                    </div>
                    <div className="px-4 py-2 relative">
                      {/**delete product */}
                      <div
                        className="absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                        onClick={() => deleteProductCartHandler(product?._id)}
                      >
                        <MdDelete />
                      </div>

                      <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                        {product?.productId?.productName}
                      </h2>
                      <p className="capitalize text-slate-500">
                        {product?.productId.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-red-600 font-medium text-lg">
                          {product?.productId?.sellingPrice}
                        </p>
                        <p className="text-slate-600 font-semibold text-lg">
                          ₹
                          {product?.productId?.sellingPrice * product?.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                          onClick={() =>
                            decreaseQty(product?._id, product?.quantity)
                          }
                        >
                          -
                        </button>
                        <span>{product?.quantity}</span>
                        <button
                          className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                          onClick={() =>
                            increaseQty(product?._id, product?.quantity)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/***summary  */}
        <div className="mt-5 lg:mt-0 w-full max-w-sm">
          {loading ? (
            <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse"></div>
          ) : (
            <div className="h-36 bg-white">
              <h2 className="text-white bg-red-600 px-4 py-1">Summary</h2>
              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Quantity</p>
                <p>{totalQuantity}</p>
              </div>

              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Total Price</p>
                <p>₹{totalPrice}</p>
              </div>

              <button className="bg-blue-600 p-2 text-white w-full mt-2">
                Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
