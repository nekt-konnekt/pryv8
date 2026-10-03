"use client";

import { useEffect, useState } from "react";

type Side = "user" | "creator";
type Answer = string;

const userQuestions = [
  { key: "vote", title: "Would you pay for private conversations with verified adults?", options: ["YE, I’d pay to chat", "Maybe, depends on the price", "Nah, not interested"] },
  { key: "experience", title: "What would you actually pay for?", options: ["Private text", "Voice calls", "Scheduled calls", "Companionship"] },
  { key: "spend", title: "What would you comfortably spend to start?", options: ["₦1,000", "₦2,500", "₦5,000", "₦10,000+"] },
];

const creatorQuestions = [
  { key: "vote", title: "Would you monetize private conversations with your audience?", options: ["YE, I’m interested", "Maybe, show me the model", "Nah, not interested"] },
  { key: "interaction", title: "What would you be willing to offer?", options: ["Private text", "Voice calls", "Scheduled calls", "Companionship"] },
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
    return <main className="page"><div className="shell"><div className="nav"><div className="logo">PRYV8</div><div className="badge">18+ research</div></div><section className="success"><div className="eyebrow">Vote recorded</div><h1>Got it.</h1><p>We’re validating whether people actually want this. Your response helps us decide what gets built next.</p></section></div></main>;
  }

  if (!side) {
    return (
      <main className="page">
        <div className="shell">
          <nav className="nav"><div className="logo">PRYV8</div><div className="badge">18+ only</div></nav>
          <section className="hero">
            <div className="eyebrow">Private conversations. Real connections.</div>
            <h1>Would you use it?</h1>
            <p>We’re testing a private marketplace where verified adults can pay for one-on-one conversations, voice calls, companionship, and attention.</p>
          </section>
          <section className="choiceGrid">
            <button className="choice" onClick={() => chooseSide("user")}><span className="num">01</span><h2>I’m here to connect</h2><p>I’d pay someone for private conversation or companionship.</p></button>
            <button className="choice" onClick={() => chooseSide("creator")}><span className="num">02</span><h2>I’m here to earn</h2><p>I’d monetize private access to my time and attention.</p></button>
          </section>
          <footer className="footer">PRYV8 is an early market-validation experiment. Adults 18+ only. No payment is being taken on this page.</footer>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="shell">
        <div className="formWrap">
          <button className="back" onClick={() => step === 0 ? setSide(null) : setStep((s) => s - 1)}>← Back</button>
          <div className="progress"><i style={{ width: `${((step + 1) / (questions.length + 1)) * 100}%` }} /></div>
          {!isContactStep ? (
            <>
              <h1 className="question">{current.title}</h1>
              <p className="sub">Pick the answer that is closest. Don’t overthink it.</p>
              <div className="options">
                {current.options.map((option) => <button key={option} className={`option ${answer === option ? "selected" : ""}`} onClick={() => select(option)}><span>{option}</span><small>{answer === option ? "✓" : "→"}</small></button>)}
              </div>
              <button className="next" disabled={!answer} onClick={next}>Continue</button>
            </>
          ) : (
            <>
              <h1 className="question">Where should we reach you?</h1>
              <p className="sub">Leave your contact after voting. We’ll only use it for this research and launch updates.</p>
              <div className="field"><label>Email</label><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@example.com" autoComplete="email" /></div>
              <div className="field"><label>WhatsApp number</label><input type="tel" value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="+234..." autoComplete="tel" /></div>
              <div className="field"><label>Anything else? Optional</label><input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px" }} aria-hidden="true" /></div>
              <label className="checks"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>I’m 18+ and agree to PRYV8 using these details to contact me about this validation research.</span></label>
              {status === "error" && <p className="sub">Something failed. Try again.</p>}
              <button className="next" disabled={!contact.email || !contact.whatsapp || !consent || status === "submitting"} onClick={submit}>{status === "submitting" ? "Saving..." : "Cast my vote"}</button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}