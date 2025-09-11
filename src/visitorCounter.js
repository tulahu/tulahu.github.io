import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const updateVisitorCount = async () => {
      const counterRef = doc(db, "visits", "counter");
      const snap = await getDoc(counterRef);

      if (snap.exists()) {
        const current = snap.data().count || 0;
        await updateDoc(counterRef, { count: current + 1 });
        setCount(current + 1);
      } else {
        console.error("Уншиж чадсангүй.");
      }
    };

    updateVisitorCount();
  }, []);

  return (
    <div style={{ fontSize: "1.2rem" }}>
      👀 Нийт зочилсон: {count !== null ? count : "Шинэчилж байна..."}
    </div>
  );
}