import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUser,
  FiPlusCircle,
  FiClipboard,
  FiLayout,
} from "react-icons/fi";

const Navbar = () => {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) return null;

  return (
    <nav className="backdrop-blur-md bg-white/70 border-b border-blue-100 px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div
        onClick={() => navigate(role === "admin" ? "/admin" : "/dashboard")}
        className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 tracking-tight cursor-pointer flex items-center gap-2"
      >
        <FiLayout className="text-blue-700" size={24} />
        Service Desk
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 text-sm font-medium">
        {role === "user" && (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition"
            >
              <FiClipboard size={18} />
              My Tickets
            </button>
            <button
              onClick={() => navigate("/raise-ticket")}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition"
            >
              <FiPlusCircle size={18} />
              Raise Ticket
            </button>
          </>
        )}

        {role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition"
          >
            <FiClipboard size={18} />
            Admin Panel
          </button>
        )}

        {/* User Info */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow hover:shadow-md transition">
          <FiUser size={16} className="text-blue-600" />
          <span className="text-gray-700">{user?.email}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-full shadow hover:shadow-lg transition"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
