/* New file – Audio Guard – 2025-09-26 */
export function speakOnce(text: string, voiceHint = "Female", rate = 1.0, volume = 0.9) {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // منع التداخل
    const u = new SpeechSynthesisUtterance(text);
    const v = window.speechSynthesis.getVoices().find(v => v.name?.includes(voiceHint));
    if (v) u.voice = v;
    u.rate = rate; u.volume = volume;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function stopVoicesOnLeave() {
  const stop = () => { try { window.speechSynthesis?.cancel(); } catch {} };
  window.addEventListener("beforeunload", stop);
  window.addEventListener("pagehide", stop);
  window.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
  return () => {
    window.removeEventListener("beforeunload", stop);
    window.removeEventListener("pagehide", stop);
  };
}

