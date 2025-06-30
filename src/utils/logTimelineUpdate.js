// src/utils/logTimelineUpdate.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const logTimelineUpdate = async (ticketId, message, performedBy, type = "status") => {
  const timelineRef = collection(db, "tickets", ticketId, "timeline");
  await addDoc(timelineRef, {
    message,
    performedBy,
    type,
    createdAt: serverTimestamp()
  });
};
