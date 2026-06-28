"use client";

import { useEffect } from "react";

const CONTACT_EMAIL = "surabhivework@gmail.com";

export default function ContactSection() {
  useEffect(() => {
    

    import("@/lib/effects/noiseGradient").then(({ initNoiseGradientSection }) => {
      const root = document.getElementById("contact");
      const form = document.getElementById("contact-form") as HTMLFormElement | null;
      const statusEl = document.getElementById("contact-status");
      const submitBtn = document.getElementById("contact-submit") as HTMLButtonElement | null;
      if (!root || !form || !statusEl || !submitBtn) return;

      initNoiseGradientSection(root, "contact-canvas-gradient", "contact-canvas-grain");

      function setStatus(message: string, type: "idle" | "success" | "error") {
        statusEl!.textContent = message;
        statusEl!.dataset.state = type;
      }

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        setStatus("", "idle");

        const formData = new FormData(form!);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const message = String(formData.get("message") ?? "").trim();

        if (!name || !email || !message) { setStatus("Please fill in all fields.", "error"); return; }

        submitBtn!.disabled = true;
        submitBtn!.textContent = "Sending…";

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message }),
          });
          const data = (await response.json().catch(() => ({}))) as { error?: string };
          if (!response.ok) { setStatus(data.error ?? "Something went wrong. Please try again.", "error"); return; }
          form!.reset();
          setStatus("Message sent. Thank you for reaching out!", "success");
        } catch {
          setStatus("Unable to send right now. Please email me directly.", "error");
        } finally {
          submitBtn!.disabled = false;
          submitBtn!.textContent = "Send message";
        }
      });
    });

    
  }, []);

  return (
    <section id="contact" className="contact" aria-labelledby="contact-heading">
      <canvas id="contact-canvas-gradient" className="contact-canvas contact-canvas--gradient" aria-hidden="true" />
      <div className="contact-inner">
        <div className="contact-copy">
          <h2 id="contact-heading" className="contact-heading">Get in Touch</h2>
          <p className="contact-lead">
            Have a project in mind or want to collaborate? Send me a message and I will get back to you.
          </p>
          <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <form className="contact-form" id="contact-form" noValidate>
          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-name">Name</label>
            <input className="contact-input" id="contact-name" name="name" type="text" autoComplete="name" required maxLength={120} />
          </div>
          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-email">Email</label>
            <input className="contact-input" id="contact-email" name="email" type="email" autoComplete="email" required maxLength={160} />
          </div>
          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-message">Message</label>
            <textarea className="contact-input contact-textarea" id="contact-message" name="message" rows={5} required maxLength={5000} />
          </div>
          <button type="submit" className="contact-submit" id="contact-submit">Send message</button>
          <p className="contact-status" id="contact-status" role="status" aria-live="polite" />
        </form>
      </div>
      <canvas id="contact-canvas-grain" className="contact-canvas contact-canvas--grain" aria-hidden="true" />
    </section>
  );
}
