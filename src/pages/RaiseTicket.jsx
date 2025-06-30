import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { addTimelineEntry } from "../utils/addTimelineEntry";

const RaiseTicket = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Bug");
  const [priority, setPriority] = useState("Medium");
  const [isPaidPriority, setIsPaidPriority] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRazorpayPayment = async () => {
    return new Promise((resolve, reject) => {
      const options = {
        key: "rzp_test_w83dQc5spcGFDY",
        amount: 100 * 100,
        currency: "INR",
        name: "Service Desk App",
        description: "Priority Ticket Payment",
        handler: (response) => resolve(response),
        prefill: { email: user.email },
        theme: { color: "#3b82f6" }
      };
      const razor = new window.Razorpay(options);
      razor.on("payment.failed", reject);
      razor.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const maxSize = 10 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) return toast.error("Unsupported file type.");
      if (file.size > maxSize) return toast.error("File too large (max 10MB).");
    }

    setLoading(true);

    try {
      let paymentInfo = null;
      let attachmentURL = null;

      if (file) {
        const storageRef = ref(storage, `attachments/${user.uid}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        attachmentURL = await getDownloadURL(snapshot.ref);
      }

      if (isPaidPriority) {
        const paymentResponse = await handleRazorpayPayment();
        paymentInfo = {
          paymentId: paymentResponse.razorpay_payment_id,
          paidAt: new Date()
        };
      }

      const ticketRef = await addDoc(collection(db, "tickets"), {
        title,
        description,
        category,
        priority: isPaidPriority ? "High" : priority,
        status: "Open",
        userId: user.uid,
        createdAt: serverTimestamp(),
        assignedTo: null,
        updates: [],
        isPaidPriority,
        paymentInfo: paymentInfo || null,
        attachment: attachmentURL || null
      });

      await addTimelineEntry(ticketRef.id, "🎫 Ticket Created", user.email, "status");

      toast.success("Ticket raised successfully!");
      setTitle("");
      setDescription("");
      setCategory("Bug");
      setPriority("Medium");
      setIsPaidPriority(false);
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white/80 backdrop-blur-md border border-blue-100 shadow-xl rounded-3xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-blue-800">
            🧾 Raise a New Ticket
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="🎯 Title (e.g. Unable to login)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 shadow-sm outline-none"
            />

            <textarea
              placeholder="📝 Describe your issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border rounded-xl h-28 focus:ring-2 focus:ring-blue-400 shadow-sm outline-none resize-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold text-gray-600">
                  🗂️ Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Bug">🐞 Bug</option>
                  <option value="Feature">✨ Feature</option>
                  <option value="Account">👤 Account</option>
                </select>
              </div>

              {!isPaidPriority && (
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-600">
                    🚦 Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400"
                  >
                    <option value="High">🔥 High</option>
                    <option value="Medium">⚖️ Medium</option>
                    <option value="Low">🐢 Low</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-600">📎 Attachment</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm border p-2 rounded-xl shadow-sm"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={isPaidPriority}
                onChange={() => setIsPaidPriority(!isPaidPriority)}
                className="accent-blue-600 scale-110"
              />
              <span>Upgrade to Paid Priority Ticket (₹100)</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              }`}
            >
              {loading
                ? isPaidPriority
                  ? "Processing Payment..."
                  : "Submitting..."
                : "🚀 Submit Ticket"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RaiseTicket;
