import React from "react";

export default function VoiceFeedback() {
  const playSound = (file: string) => {
    const audio = new Audio(`/assets/sounds/${file}`);
    audio.play();
  };
  return (
    <div style={{ padding: 20 }}>
      <h3>🎧 مؤثرات صوتية</h3>
      <button onClick={() => playSound("success.mp3")}>✅ تشغيل نجاح</button>
      <button onClick={() => playSound("error.mp3")} style={{ marginInlineStart: 10 }}>⛔ تشغيل خطأ</button>
    </div>
  );
}