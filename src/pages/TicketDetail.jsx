import { useEffect, useState, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { FiPaperclip } from "react-icons/fi";
import TicketCommentSection from "../components/TicketCommentSection";

const TicketDetail = () => {
  const { id } = useParams();
  const { user, role } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketDoc = await getDoc(doc(db, "tickets", id));
        if (ticketDoc.exists()) {
          const data = ticketDoc.data();
          if (data.userId !== user.uid && role !== "admin") {
            setTicket("unauthorized");
          } else {
            setTicket({ id: ticketDoc.id, ...data });
          }
        } else {
          setTicket(null);
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTicket();
  }, [id, user, role]);

  useEffect(() => {
    if (ticket?.id) {
      const timelineRef = collection(db, "tickets", ticket.id, "timeline");
      const q = query(timelineRef, orderBy("createdAt", "asc"));
      const unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()?.toLocaleString() || "Unknown",
        }));
        setTimeline(list);
      });
      return () => unsub();
    }
  }, [ticket?.id]);

  if (loading) return <p className="text-center text-lg text-blue-700">⏳ Loading Ticket...</p>;
  if (ticket === "unauthorized") return <Navigate to="/dashboard" />;
  if (!ticket) return <p className="text-center text-red-600 text-lg">❌ Ticket not found.</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 mb-6 tracking-tight">
          🎟️ Ticket Detail
        </h2>

        <div className="glass-card p-6 rounded-2xl border border-blue-200 shadow-xl backdrop-blur-lg">
          <h3 className="text-2xl font-semibold text-blue-800 mb-2">
            {ticket.title}
          </h3>
          <p className="text-gray-700 mb-4 text-base leading-relaxed">{ticket.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="bg-blue-50 px-3 py-1 rounded-full font-medium shadow-sm">
              📂 <strong>Category:</strong> {ticket.category}
            </span>
            <span className="bg-red-50 px-3 py-1 rounded-full font-medium shadow-sm">
              🚨 <strong>Priority:</strong> {ticket.priority}
            </span>
            <span className="bg-green-50 px-3 py-1 rounded-full font-medium shadow-sm">
              📌 <strong>Status:</strong> {ticket.status}
            </span>
            {ticket.attachment && (
              <a
                href={ticket.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
              >
                <FiPaperclip />
                View Attachment
              </a>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4">🕒 Activity Timeline</h3>

        {timeline.length === 0 ? (
          <p className="text-gray-500">No activity yet.</p>
        ) : (
          <ul className="relative border-l-2 border-blue-400 pl-5 space-y-6">
            {timeline.map((item) => (
              <li key={item.id} className="relative">
                <div className="absolute -left-2 top-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full shadow-md animate-pulse" />
                <div
                  className={`p-4 rounded-xl shadow-md border transition-all duration-300 ${
                    item.type === "status"
                      ? "bg-green-50 border-green-300 text-green-900"
                      : item.type === "comment"
                      ? "bg-yellow-50 border-yellow-300 text-yellow-900"
                      : "bg-slate-50 border-gray-200 text-gray-800"
                  }`}
                >
                  <p className="font-medium">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    By {item.performedBy} • {item.createdAt}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <TicketCommentSection ticketId={ticket.id} />
        </div>
      </div>
    </>
  );
};

export default TicketDetail;
