import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import Context from "./context";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice.js";
const apiurl = import.meta.env.VITE_API_URL;
const App = () => {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const fetchUserCart = async () => {
    const res = await axios.get(`${apiurl}/api/countAddToCartProduct`);
    const count = res.data.data.count;
    setCartProductCount(count);
  };

  const fetchUserDetails = async () => {
    const dataResponse = await axios.get(`${apiurl}/api/user-details`, {
      withCredentials: true,
    });

    if (dataResponse.data.success) {
      dispatch(setUserDetails(dataResponse.data.data));
    }
  };
  useEffect(() => {
    fetchUserDetails();
    fetchUserCart();
  }, []);

  return (
    <>
      <Context.Provider
        value={{ fetchUserDetails, cartProductCount, fetchUserCart }}
      >
        <Header />
        <Toaster />
        <main className="min-h-[calc(100vh-120px)] pt-16">
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
};

export default App;
