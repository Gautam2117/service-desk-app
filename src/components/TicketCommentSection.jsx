import { useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { addTimelineEntry } from "../utils/addTimelineEntry";
import { FiSend, FiMessageCircle, FiAtSign } from "react-icons/fi";

const TicketCommentSection = ({ ticketId }) => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "tickets", ticketId, "timeline"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(list.filter((item) => item.type === "comment"));
    });
    return () => unsub();
  }, [ticketId]);

  const parseMentions = (text) => {
    const regex = /@([\w.@]+)/g;
    const mentions = [];
    let match;
    while ((match = regex.exec(text))) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const mentions = parseMentions(comment);

    const targetCollection = replyingTo
      ? collection(db, "tickets", ticketId, "timeline", replyingTo, "replies")
      : collection(db, "tickets", ticketId, "timeline");

    await addDoc(targetCollection, {
      message: comment,
      performedBy: user.email,
      createdAt: serverTimestamp(),
      type: replyingTo ? "reply" : "comment",
      mentions,
    });

    if (!replyingTo) {
      await addTimelineEntry(ticketId, "\ud83d\udd28 Comment Added", user.email, "comment");
    }

    setComment("");
    setReplyingTo(null);
  };

  const CommentItem = ({ item }) => {
    const [replies, setReplies] = useState([]);

    useEffect(() => {
      const replyRef = collection(
        db,
        "tickets",
        ticketId,
        "timeline",
        item.id,
        "replies"
      );
      const q = query(replyRef, orderBy("createdAt", "asc"));
      const unsub = onSnapshot(q, (snapshot) => {
        const replyList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReplies(replyList);
      });
      return () => unsub();
    }, [item.id]);

    return (
      <div className="border border-gray-300 rounded p-4 mb-4 bg-yellow-50 shadow-sm">
        <div className="text-sm">
          <p className="mb-1 whitespace-pre-wrap">{item.message}</p>
          <p className="text-xs text-gray-500">By {item.performedBy}</p>
          {item.mentions?.length > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              Mentions: {item.mentions.join(", ")}
            </p>
          )}
        </div>
        <button
          onClick={() => setReplyingTo(item.id)}
          className="text-xs text-blue-700 mt-1 hover:underline"
        >
          ↪️ Reply
        </button>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="ml-4 mt-2 space-y-2">
            {replies.map((r) => (
              <div
                key={r.id}
                className="text-sm p-2 rounded bg-gray-100 border border-gray-200"
              >
                <p>{r.message}</p>
                <p className="text-xs text-gray-500">
                  By {r.performedBy}
                  {r.mentions?.length > 0 && ` | Mentions: ${r.mentions.join(", ")}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <FiMessageCircle /> Comments & Activity
      </h3>

      {comments.map((item) => (
        <CommentItem key={item.id} item={item} />
      ))}

      <form onSubmit={handleSubmit} className="mt-6 space-y-2">
        {replyingTo && (
          <p className="text-sm text-gray-500 mb-1">
            Replying to comment ID: <code>{replyingTo}</code>
            <button
              onClick={() => setReplyingTo(null)}
              type="button"
              className="text-red-500 underline ml-2"
            >
              Cancel
            </button>
          </p>
        )}

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add details, updates, or mention someone using @..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 shadow-sm"
        />

        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow-md"
        >
          <FiSend /> {replyingTo ? "Reply" : "Comment"}
        </button>
      </form>
    </div>
  );
};

export default TicketCommentSection;
