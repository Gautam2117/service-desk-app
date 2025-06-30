import { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  query
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  FiTag,
  FiCheckCircle,
  FiEdit3,
  FiUserCheck,
  FiPaperclip,
  FiAlertTriangle,
  FiMessageCircle,
} from "react-icons/fi";
import { addTimelineEntry } from "../utils/addTimelineEntry";
import TicketCommentSection from "../components/TicketCommentSection";
import { toast } from "react-toastify";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

const AdminPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ status: {}, priority: {} });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.email) return;

    const q = query(collection(db, "tickets"));
    const unsub = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() || new Date();
        const isEscalated =
          data.status === "Open" && new Date() - createdAt > 48 * 60 * 60 * 1000;

        return {
          id: doc.id,
          ...data,
          isEscalated,
        };
      });

      setTickets(results);

      const statusCount = {};
      const priorityCount = {};
      results.forEach((t) => {
        statusCount[t.status] = (statusCount[t.status] || 0) + 1;
        priorityCount[t.priority] = (priorityCount[t.priority] || 0) + 1;
      });
      setStats({ status: statusCount, priority: priorityCount });
    });

    return () => unsub();
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;

    const q = query(collection(db, "tickets"));
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((ticketDoc) => {
        const ticketId = ticketDoc.id;
        const timelineRef = collection(db, "tickets", ticketId, "timeline");

        onSnapshot(timelineRef, (timelineSnap) => {
          timelineSnap.docs.forEach((doc) => {
            const data = doc.data();
            if (
              data.mentions &&
              data.mentions.includes(user.email) &&
              data.createdAt?.toDate?.() > new Date(Date.now() - 60000)
            ) {
              toast.info(`📢 You were mentioned in ticket: ${ticketDoc.data().title}`, {
                position: "top-right",
                autoClose: 5000,
              });
            }
          });
        });
      });
    });

    return () => unsub();
  }, [user?.email]);

  const updateStatus = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), {
        status: newStatus,
        assignedTo: user.uid,
        updatedAt: serverTimestamp(),
      });

      await addTimelineEntry(
        ticketId,
        `✅ Ticket marked as ${newStatus}`,
        user.email,
        "status"
      );
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-900">
          🛠️ Admin Ticket Dashboard
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {Object.entries(stats.status).map(([status, count]) => (
            <div key={status} className="rounded-xl bg-gradient-to-tr from-blue-100 to-blue-200 p-6 shadow-lg text-center">
              <p className="text-sm text-blue-700 uppercase font-semibold tracking-wide">{status}</p>
              <p className="text-3xl font-bold text-blue-900">{count}</p>
            </div>
          ))}
          {Object.entries(stats.priority).map(([priority, count]) => (
            <div key={priority} className="rounded-xl bg-gradient-to-tr from-green-100 to-green-200 p-6 shadow-lg text-center">
              <p className="text-sm text-green-700 uppercase font-semibold tracking-wide">{priority} Priority</p>
              <p className="text-3xl font-bold text-green-900">{count}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search by title, status or priority..."
            className="w-full sm:max-w-md px-5 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              onClick={() => exportToCSV(filteredTickets)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium shadow-md"
            >
              📄 Export CSV
            </button>
            <button
              onClick={() => exportToPDF(filteredTickets)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium shadow-md"
            >
              📘 Export PDF
            </button>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <p className="text-center text-gray-600">No matching tickets found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`rounded-2xl p-6 border shadow-xl transition hover:shadow-2xl relative bg-white/90 backdrop-blur-sm ${
                  ticket.isEscalated ? "border-red-500" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-blue-800">{ticket.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    ticket.status === "Resolved"
                      ? "bg-green-100 text-green-800"
                      : ticket.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {ticket.status}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-4">{ticket.description}</p>

                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1"><FiTag /> {ticket.category}</span>
                  <span className="flex items-center gap-1"><FiEdit3 /> {ticket.priority}</span>
                  {ticket.assignedTo && (
                    <span className="flex items-center gap-1"><FiUserCheck /> Assigned</span>
                  )}
                  {ticket.attachment && (
                    <a href={ticket.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <FiPaperclip /> View Attachment
                    </a>
                  )}
                  {ticket.isEscalated && (
                    <span className="text-red-600 font-semibold flex items-center gap-1">
                      <FiAlertTriangle /> Escalated
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-3 flex-wrap">
                  {ticket.status === "Open" && (
                    <button
                      onClick={() => updateStatus(ticket.id, "In Progress")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
                    >
                      <FiEdit3 /> Start Progress
                    </button>
                  )}
                  {ticket.status !== "Resolved" && (
                    <button
                      onClick={() => updateStatus(ticket.id, "Resolved")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
                    >
                      <FiCheckCircle /> Mark Resolved
                    </button>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-1 text-gray-700">
                    <FiMessageCircle /> Comments
                  </h4>
                  <TicketCommentSection ticketId={ticket.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
