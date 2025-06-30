import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { FiTag, FiZap, FiCheckCircle, FiPaperclip } from "react-icons/fi";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "tickets"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(results);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-center mb-10">
          📋 My Tickets
        </h2>

        {tickets.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You haven't raised any tickets yet.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/ticket/${ticket.id}`)}
                className="cursor-pointer backdrop-blur-md bg-white/60 border border-blue-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-2xl font-semibold text-blue-800">
                    {ticket.title}
                  </h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-semibold shadow-sm ${
                      ticket.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="text-gray-700 text-base mb-4">
                  {ticket.description}
                </p>

                <div className="text-sm text-gray-700 flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-md shadow-sm">
                    <FiTag className="text-blue-600" />
                    <strong>Category:</strong> {ticket.category}
                  </span>
                  <span className="flex items-center gap-2 bg-red-50 px-2 py-1 rounded-md shadow-sm">
                    <FiZap className="text-red-500" />
                    <strong>Priority:</strong> {ticket.priority}
                  </span>
                  {ticket.status === "Resolved" && (
                    <span className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded-md shadow-sm">
                      <FiCheckCircle className="text-green-600" />
                      Resolved
                    </span>
                  )}
                  {ticket.attachment && (
                    <a
                      href={ticket.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-blue-600 underline hover:text-blue-800"
                    >
                      <FiPaperclip />
                      View Attachment
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
