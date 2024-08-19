import axios from "axios";
import toast from "react-hot-toast";
const apiurl = import.meta.env.VITE_API_URL;

export const addToCart = async (e, productId) => {
  e?.stopPropagation();
  e.preventDefault();
  try {
    const res = await axios.post(`${apiurl}/api/addtocart`, { productId });
    // console.log(res.data);
    if (res.data.success) {
      toast.success(res.data.message, { position: "top-center" });
      return res.data; // Return the added product data
    } else {
      toast.error(res.data.message, { position: "top-center" });
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data.message || "Please Login";
      toast.error(errorMessage, { position: "top-center" });
    } else {
      console.error("Fetch Error:", error.message);
      toast.error("An error occurred while fetching data.", {
        position: "top-center",
      });
    }
  }
  return null;
};
