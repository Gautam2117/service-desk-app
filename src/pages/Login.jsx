import { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiLogIn } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);

  if (user && role) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl text-white animate-fade-in space-y-6"
      >
        <div className="text-center space-y-1">
          <img
            src="/service_desk_logo.png"
            alt="Service Desk Logo"
            className="mx-auto w-20 h-20 mb-4 object-contain rounded-full bg-white/10 p-2 shadow-lg backdrop-blur"
          />
          {/* <FiLogIn className="mx-auto text-4xl text-green-400 drop-shadow-glow" /> */}
          <h2 className="text-3xl font-extrabold tracking-wide">Welcome Back</h2>
          <p className="text-sm text-gray-300">Enter your credentials to continue</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-gray-200 p-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-gray-200 p-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 transition-all font-semibold text-white text-lg tracking-wide shadow-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-300">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:underline cursor-pointer font-medium"
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
