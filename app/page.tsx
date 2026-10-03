"use client";

import { useEffect, useState } from "react";

type Side = "user" | "creator";
type Answer = string;

const userQuestions = [
  { key: "vote", title: "Would you pay for a private conversation with someone you like?", options: ["Yes, I’d pay to chat", "Maybe, depends on the price", "Not for me"] },
  { key: "experience", title: "What kind of connection interests you most?", options: ["Private text", "Voice calls", "Video calls", "Scheduled calls", "Companionship"] },
  { key: "spend", title: "What would you comfortably spend to start?", options: ["₦1,000", "₦2,500", "₦5,000", "₦10,000+"] },
];

const creatorQuestions = [
  { key: "vote", title: "Would you earn from private conversations with your audience?", options: ["Yes, I’m interested", "Maybe, show me the model", "Not for me"] },
  { key: "interaction", title: "What would you be comfortable offering?", options: ["Private text", "Voice calls", "Video calls", "Scheduled calls", "Companionship"] },
  { key: "audience", title: "How big is your current audience?", options: ["Under 1k", "1k–5k", "5k–25k", "25k+"] },
];

export default function Home() {
  const [side, setSide] = useState<Side | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [contact, setContact] = useState({ email: "", whatsapp: "" });
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [source, setSource] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSource(params.get("utm_source") || params.get("source") || "direct");
  }, []);

  const questions = side === "user" ? userQuestions : creatorQuestions;
  const current = questions[step];
  const isContactStep = step === questions.length;
  const answer = current ? answers[current.key] : undefined;

  function chooseSide(next: Side) {
    setSide(next);
    setStep(0);
    setAnswers({});
    setStatus("idle");
  }

  function select(value: string) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  }

  function next() {
    if (step < questions.length) setStep((s) => s + 1);
  }

  async function submit() {
    if (!side || !consent || !contact.email || !contact.whatsapp) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          side,
          answers,
          email: contact.email,
          whatsapp: contact.whatsapp,
          source,
          honeypot,
          age_confirmed: true,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="page">
        <div className="shell">
          <div className="nav"><div className="logo">PRYV8</div><div className="badge">18+ research</div></div>
          <section className="success">
            <div className="successIcon">✓</div>
            <div className="eyebrow">Vote recorded</div>
            <h1>Thanks for being early.</h1>
            <p>Your response helps us figure out what PRYV8 should actually become.</p>
          </section>
        </div>
      </main>
    );
  }

  if (!side) {
    return (
      <main className="page">
        <div className="shell">
          <nav className="nav">
            <div className="logo">PRYV8</div>
            <div className="navRight"><span className="tinyTrust">Private by design</span><div className="badge">18+ only</div></div>
          </nav>

          <section className="hero">
            <div className="eyebrow"><span className="dot" /> We’re building something new</div>
            <h1>Private conversations. <span>Real connections.</span></h1>
            <p>PRYV8 is a platform for adults to connect one-on-one with people they’re interested in through private text, voice, or video conversations.</p>
            <p>Find someone you want to talk to, choose how you want to connect, and pay for their time or attention. If you have an audience, PRYV8 gives you a way to earn from private conversations and direct access to your time.</p>
            <div className="heroMeta"><span>30 sec</span><span>•</span><span>No payment</span><span>•</span><span>Just a quick vote</span></div>
          </section>

          <section className="choiceIntro">
            <h2>What brings you here?</h2>
            <p>Pick the side that sounds most like you.</p>
          </section>

          <section className="choiceGrid">
            <button className="choice choiceConnect" onClick={() => chooseSide("user")}>
              <div className="choiceTop"><span className="choiceIcon">↗</span><span className="num">01</span></div>
              <h2>I want to connect</h2>
              <p>I’d pay for private conversation, time, or companionship with someone I’m interested in.</p>
              <span className="choiceCta">Tell us what you want <b>→</b></span>
            </button>
            <button className="choice choiceEarn" onClick={() => chooseSide("creator")}>
              <div className="choiceTop"><span className="choiceIcon">✦</span><span className="num">02</span></div>
              <h2>I want to earn</h2>
              <p>I’d monetize private access to my time and conversations with my audience.</p>
              <span className="choiceCta">Tell us what you’d offer <b>→</b></span>
            </button>
          </section>

          <footer className="footer">
            <span>PRYV8 is being built for adults 18+.</span>
            <span>No payment is taken here.</span>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="shell">
        <div className="formWrap">
          <button className="back" onClick={() => step === 0 ? setSide(null) : setStep((s) => s - 1)}>← Back</button>
          <div className="progressLabel"><span>Question {Math.min(step + 1, questions.length + 1)} of {questions.length + 1}</span><span>{Math.round(((step + 1) / (questions.length + 1)) * 100)}%</span></div>
          <div className="progress"><i style={{ width: `${((step + 1) / (questions.length + 1)) * 100}%` }} /></div>

          {!isContactStep ? (
            <>
              <h1 className="question">{current.title}</h1>
              <p className="sub">Pick the answer that feels closest. There’s no right answer.</p>
              <div className="options">
                {current.options.map((option) => (
                  <button key={option} className={`option ${answer === option ? "selected" : ""}`} onClick={() => select(option)}>
                    <span>{option}</span><small>{answer === option ? "✓" : "→"}</small>
                  </button>
                ))}
              </div>
              <button className="next" disabled={!answer} onClick={next}>Continue <span>→</span></button>
            </>
          ) : (
            <>
              <h1 className="question">Where should we reach you?</h1>
              <p className="sub">Leave your contact after voting. We’ll only use it for this research and launch updates.</p>
              <div className="field"><label>Email</label><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@example.com" autoComplete="email" /></div>
              <div className="field"><label>WhatsApp number</label><input type="tel" value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="+234..." autoComplete="tel" /></div>
              <input aria-hidden="true" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="honeypot" autoComplete="off" />
              <label className="checks"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>I’m 18+ and agree to PRYV8 using these details to contact me about this validation research.</span></label>
              {status === "error" && <p className="errorText">Something failed. Try again.</p>}
              <button className="next" disabled={!contact.email || !contact.whatsapp || !consent || status === "submitting"} onClick={submit}>{status === "submitting" ? "Saving..." : <>Cast my vote <span>→</span></>}</button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
