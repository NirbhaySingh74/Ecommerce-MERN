import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import VerticalCart from "../components/VerticalCart";
const apiurl = import.meta.env.VITE_API_URL;

const SearchProduct = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/search?q=${query}`);
      console.log(res.data);
      setData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query) {
      search();
    }
  }, [query]);

  return <VerticalCart loading={loading} data={data} />;
};

export default SearchProduct;
