import { Link, useLocation } from "react-router-dom";
import shopsy from "../assets/shopsy.png";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../context";
const apiurl = import.meta.env.VITE_API_URL;

const Header = () => {
  const userData = useSelector((state) => state?.user?.user);
  const { cartProductCount } = useContext(Context);
  const searchInput = useLocation();
  const [search, setSearch] = useState(searchInput?.search?.split("=")[1]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const items = useSelector((state) => state.cart.items);

  const [menuDisplay, setMenuDisplay] = useState(false);

  const handleLogout = async () => {
    const fetchData = await axios.get(`${apiurl}/api/logout`);

    console.log(fetchData);
    // console.log("logout get called");
    if (fetchData.data.success) {
      toast.success(fetchData.data.message, { position: "top-right" });
      dispatch(setUserDetails(null));
      navigate("/");
    }
    if (fetchData.error) {
      toast.error(fetchData.message);
    }
    // console.log(fetchData);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearch(value);
    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };
  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center px-2 justify-between">
        <div className="cursor-pointer">
          <Link to={"/"}>
            <img src={shopsy} alt="" width={50} height={20} />
          </Link>
        </div>
        <div className="hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2">
          <input
            type="text"
            placeholder="search product here..."
            className="w-full outline-none"
            onChange={searchHandler}
            value={search}
          />
          <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
            <GrSearch />
          </div>
        </div>
        <div className="flex items-center gap-7">
          <div className="relative flex justify-center">
            {userData?._id && (
              <div
                className="text-4xl cursor-pointer relative flex justify-center"
                onClick={() => setMenuDisplay((preve) => !preve)}
              >
                {userData?.profilePic ? (
                  <img
                    src={userData?.profilePic}
                    alt={userData?.name}
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
            )}
            {menuDisplay && (
              <div className="absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded">
                <nav>
                  <Link
                    to={"admin-panel"}
                    className="whitespace-nowrap hover:bg-slate-100 p-2 "
                    onClick={() => setMenuDisplay((preve) => !preve)}
                  >
                    Admin Panel
                  </Link>
                </nav>
              </div>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1 text-center">
            {userData && (
              <Link to="/cart" className="relative inline-block">
                <span className="font-bold absolute top-0 right-0 -mt-2 -mr-2 px-2 py-1 rounded-full bg-red-500 text-white">
                  {cartProductCount}
                </span>
                <FaShoppingCart className="w-10 h-10 cursor-pointer" />
              </Link>
            )}
          </div>
          {userData ? (
            <button
              className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link to="login">
              <button className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
