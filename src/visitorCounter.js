import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import HoverTranslation from "./utils/HoverTranslation"; // adjust path if needed

export default function VisitorCounter({ language }) {
  const [count, setCount] = useState(null);

  const mongolianDigits = ['᠐', '᠑', '᠒', '᠓', '᠔', '᠕', '᠖', '᠗', '᠘', '᠙'];

  const convertToMongolianNumber = (num) => {
    return String(num)
      .split('')
      .map(d => mongolianDigits[parseInt(d, 10)] || d)
      .join('');
  };

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

  const labelTraditional = 'ᠨᠡᠶᠢᠲᠡ ᠵᠣᠴᠢᠯᠠᠭᠰᠠᠨ᠄';
  const labelCyrillic = 'Нийт зочилсон:';

  const loadingTraditional = 'ᠰᠢᠨᠡᠴᠢᠯᠡᠵᠦ ᠪᠠᠶᠢᠨ᠎ᠠ...';
  const loadingCyrillic = 'Шинэчилж байна...';

  const displayCount =
    count !== null
      ? language === 'traditional'
        ? convertToMongolianNumber(count)
        : count
      : language === 'traditional'
        ? loadingTraditional
        : loadingCyrillic;

  return (
    <div style={{ fontSize: "1.2rem", writingMode: language === 'traditional' ? 'vertical-rl' : 'horizontal-tb' }}>
      👀{' '}
      {language === 'traditional' ? (
        <HoverTranslation
          traditionalText={labelTraditional}
          cyrillicText={labelCyrillic}
          language={language}
          component="span"
        />
      ) : (
        labelCyrillic
      )}{' '}
      {language === 'traditional' ? (
        <HoverTranslation
          traditionalText={displayCount}
          cyrillicText={count !== null ? count.toString() : loadingCyrillic}
          language={language}
          component="span"
        />
      ) : (
        displayCount
      )}
    </div>
  );
}