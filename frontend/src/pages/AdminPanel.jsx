import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const apiurl = import.meta.env.VITE_API_URL;

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const [allUser, setAllUser] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();

  const getAllUser = async () => {
    try {
      const res = await axios.get(`${apiurl}/api/allusers/`);
      setAllUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const editHandler = (userId, currentRole) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole);
  };

  const saveHandler = async (userId) => {
    try {
      await axios.put(`${apiurl}/api/users/${userId}`, { role: selectedRole });
      setEditingUserId(null);
      await getAllUser();
      toast.success("User updated!", { position: "top-center" });

      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex hidden">
      <aside className="bg-white min-h-full w-full max-w-60 customShadow">
        <div className="h-32 flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                alt={user?.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="capitalize text-lg font-semibold">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>
        {/* navigation */}
        <div>
          <nav className="grid p-4">
            <Link to={"all-users"} className="px-2 py-1 hover:bg-slate-100">
              All Users
            </Link>
            <Link to={"products"} className="px-2 py-1 hover:bg-slate-100">
              Products
            </Link>
          </nav>
        </div>
      </aside>
      <main className="w-full h-full p-2">
        <Outlet
          context={{
            allUser,
            editHandler,
            saveHandler,
            editingUserId,
            selectedRole,
            setSelectedRole,
          }}
        />
      </main>
    </div>
  );
};

export default AdminPanel;
