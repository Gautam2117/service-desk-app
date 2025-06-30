import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const addTimelineEntry = async (ticketId, message, performedBy = "system", type = "info") => {
  const timelineRef = collection(db, "tickets", ticketId, "timeline");
  await addDoc(timelineRef, {
    message,
    type,
    performedBy,
    createdAt: serverTimestamp(),
  });
};
