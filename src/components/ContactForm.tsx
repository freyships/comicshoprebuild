"use client";

import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-6">
        <p className="display text-3xl text-pulp-red mb-3">★ KAPOW! ★</p>
        <p className="display text-xl text-ink mb-2">Message sent.</p>
        <p className="text-ink-soft italic mb-6">
          We'll write back as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-pulp btn-pulp-white"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Your Name" htmlFor="name">
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="input-pulp"
        />
      </Field>

      <Field label="Email Address" htmlFor="email">
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="input-pulp"
        />
      </Field>

      <Field label="Subject" htmlFor="subject">
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="input-pulp"
        >
          <option value="">Pick a topic…</option>
          <option value="listing-error">Report a listing error</option>
          <option value="new-store">Suggest a new store</option>
          <option value="claim-listing">Claim a listing</option>
          <option value="general">General question</option>
          <option value="other">Other</option>
        </select>
      </Field>

      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="input-pulp resize-y"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-pulp disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending…" : "Send Message →"}
        </button>
        {status === "error" && (
          <p className="text-sm text-pulp-red font-mono">
            Something went wrong. Email us directly at{" "}
            <a
              href="mailto:comicbookstorefinder@gmail.com"
              className="underline underline-offset-2"
            >
              comicbookstorefinder@gmail.com
            </a>
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block display text-xs uppercase tracking-widest text-ink mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
