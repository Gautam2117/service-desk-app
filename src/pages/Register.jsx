import { useState, useContext } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiUserPlus } from "react-icons/fi";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user, role } = useContext(AuthContext);

  if (user && role) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "user",
        createdAt: new Date(),
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white/10 backdrop-blur-md text-white p-8 rounded-2xl border border-white/20 shadow-2xl space-y-6 animate-fade-in"
      >
        <div className="text-center space-y-1">
          <img
            src="/service_desk_logo.png"
            alt="Service Desk Logo"
            className="mx-auto w-20 h-20 mb-4 object-contain rounded-full bg-white/10 p-2 shadow-lg backdrop-blur"
          />
          {/* <FiUserPlus className="mx-auto text-4xl text-green-400 drop-shadow-glow" /> */}
          <h2 className="text-3xl font-extrabold tracking-wide">Create Account</h2>
          <p className="text-sm text-gray-300">Join us and raise your first ticket!</p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 bg-white/20 backdrop-blur-sm text-white placeholder-gray-200 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 bg-white/20 backdrop-blur-sm text-white placeholder-gray-200 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <input
          type="password"
          placeholder="Password (Min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 bg-white/20 backdrop-blur-sm text-white placeholder-gray-200 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-lg tracking-wide transition-all shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-400 hover:underline cursor-pointer font-medium"
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
