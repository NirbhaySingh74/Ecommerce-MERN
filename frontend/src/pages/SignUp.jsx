import { useState } from "react";
import loginIcons from "../assets/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiurl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const initialUserState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicFile: null,
  };

  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [user, setUser] = useState(initialUserState);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // const [userData, setUserData] = useState([]);
  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files.length > 0) {
      const file = files[0];
      setUser((prevUser) => ({
        ...prevUser,
        profilePicFile: file,
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!user.name || !user.email || !user.password || !user.confirmPassword) {
      setError("All fields are required");
      toast.error("All fields are required", { position: "top-right" });
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", { position: "top-right" });
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("profilePic", user.profilePicFile);

    try {
      const res = await axios.post(`${apiurl}/api/sign-up`, formData);
      toast.success("User signed up successfully", { position: "top-right" });
      setUser(initialUserState);
      console.log(res);
      // setUserData(res.data);
      navigate("/login");
      // console.log(user);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          toast.error("User already registered", { position: "top-center" });
          setError("User already registered");
        } else {
          toast.error(error.response.data.message || "User can't register", {
            position: "top-right",
          });
          setError(error.response.data.message || "User can't register");
        }
      } else {
        toast.error("An error occurred", { position: "top-center" });
        setError("An error occurred");
      }
      console.error("User can't register", error);
    }
  };

  return (
    <section id="signup">
      <div className="mx-auto container p-4">
        <div className="bg-white shadow-md p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
            <img
              src={
                user.profilePicFile
                  ? URL.createObjectURL(user.profilePicFile)
                  : loginIcons
              }
              alt="profile"
            />
            <form>
              <label>
                <div className="text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full">
                  Upload Photo
                </div>
                <input
                  type="file"
                  className="hidden"
                  name="profilePic"
                  onChange={handleOnChange}
                />
              </label>
            </form>
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Name: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="text"
                  placeholder="Enter name"
                  required
                  name="name"
                  value={user.name}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="grid">
              <label>Email: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  required
                  name="email"
                  value={user.email}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label>Password: </label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  value={user.password}
                  name="password"
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
            </div>
            <div>
              <label>Confirm Password: </label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={confirmShowPassword ? "text" : "password"}
                  placeholder="Enter password again"
                  required
                  value={user.confirmPassword}
                  name="confirmPassword"
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setConfirmShowPassword((prev) => !prev)}
                >
                  <span>
                    {confirmShowPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <Link
                to={"/forgot-password"}
                className="block w-fit ml-auto hover:underline hover:text-red-600"
              >
                Forgot password?
              </Link>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              Sign Up
            </button>
            {error && <p className="text-red-700 mt-5 text-xl">{error}</p>}
          </form>

          <p className="my-5">
            Already Registered?{" "}
            <Link
              to={"/login"}
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
