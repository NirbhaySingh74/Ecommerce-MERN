import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import productCategory from "../helper/productCategory";
import VerticalCart from "./VerticalCart";
const apiurl = import.meta.env.VITE_API_URL;

const CategoryProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectCategory, setSelectCategory] = useState({});
  const [filterCategory, setFilterCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState(""); // State to store the sorting order

  useEffect(() => {
    const url = new URLSearchParams(location.search);
    const urlCategoryListArray = url.getAll("category");

    const initialCategories = {};
    urlCategoryListArray.forEach((category) => {
      initialCategories[category] = true;
    });
    setSelectCategory(initialCategories);
  }, [location.search]);

  const fetchData = async () => {
    const res = await axios.post(`${apiurl}/api/filter-product`, {
      category: filterCategory,
    });
    let sortedData = res?.data?.data || [];

    if (sortOrder === "lowToHigh") {
      sortedData = sortedData.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      sortedData = sortedData.sort((a, b) => b.price - a.price);
    }

    setData(sortedData);
    setLoading(false);
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));

    // Update URL
    const updatedCategories = {
      ...selectCategory,
      [value]: checked,
    };

    const selectedCategories = Object.keys(updatedCategories).filter(
      (categoryKey) => updatedCategories[categoryKey]
    );

    const params = new URLSearchParams();
    selectedCategories.forEach((category) =>
      params.append("category", category)
    );

    navigate({ search: params.toString() });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory).filter(
      (categoryKeyName) => selectCategory[categoryKeyName]
    );
    setFilterCategory(arrayOfCategory);
  }, [selectCategory]);

  useEffect(() => {
    fetchData();
  }, [filterCategory, sortOrder]); // Re-fetch data when sortOrder changes

  return (
    <div className="container mx-auto p-4">
      <div className="hidden lg:grid grid-cols-[200px,1fr] ">
        <div className="bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll">
          <div>
            <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300 ">
              Sort by
            </h3>
            <form className="text-sm flex flex-col gap-2 py-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="sortBy"
                  value="lowToHigh"
                  checked={sortOrder === "lowToHigh"}
                  onChange={handleSortChange}
                />
                <label>Price - Low To High</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="sortBy"
                  value="highToLow"
                  checked={sortOrder === "highToLow"}
                  onChange={handleSortChange}
                />
                <label>Price - High To Low</label>
              </div>
            </form>
          </div>
          <div>
            <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300 ">
              Category
            </h3>
            <form className="text-sm flex flex-col gap-2 py-2">
              {productCategory.map((category, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="category"
                    id={category?.value}
                    value={category?.value}
                    checked={selectCategory[category?.value] || false}
                    onChange={handleSelectCategory}
                  />
                  <label htmlFor={category?.value}>{category?.label}</label>
                </div>
              ))}
            </form>
          </div>
        </div>
        <div>
          <VerticalCart data={data} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
