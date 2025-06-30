// File: src/components/AdminToastAlerts.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

const AdminToastAlerts = ({ userEmail }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "tickets"),
      orderBy("updatedAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const updates = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.status !== "Resolved" &&
          (data.updatedBy === userEmail || data.mentions?.includes(userEmail))
        ) {
          updates.push({ id: doc.id, ...data });
        }
      });
      setAlerts(updates);
    });

    return () => unsub();
  }, [userEmail]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-2 rounded shadow-md"
        >
          <p className="font-semibold">🔔 Ticket Update</p>
          <p className="text-sm">{alert.title} — {alert.status}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminToastAlerts;