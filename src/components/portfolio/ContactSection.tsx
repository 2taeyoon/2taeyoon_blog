"use client";

import React, { useEffect, useRef, useState } from "react";
import { useIntersection } from "@/hooks/useIntersection";

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/2taeyoon", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ) },
  { label: "LinkedIn", href: "https://linkedin.com", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  ) },
  { label: "Twitter/X", href: "https://twitter.com", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ) },
  { label: "Blog", href: "/blog", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 4h16v12H4zM8 20h8M12 16v4" />
    </svg>
  ) },
];

export default function ContactSection() {
  const sectionRef = useIntersection<HTMLElement>({ threshold: 0.1 });
  const magnetRef = useRef<HTMLButtonElement>(null);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Magnetic button
  useEffect(() => {
    const btn = magnetRef.current;
    if (!btn) return;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.38}px, ${y * 0.38}px)`;
    };

    const onLeave = () => {
      btn.style.transform = "";
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1800);
  };

  return (
    <section id="contact" ref={sectionRef} className="pf-contact reveal-section">
      <div>
			<div className="pf-contact__bg" aria-hidden="true" />

<div className="pf-contact__inner">
	<div className="pf-contact__header">
		<p className="pf-section-label reveal-item">Get In Touch</p>
		<h2 className="pf-section-title reveal-item">
			Let&apos;s build something
			<br />
			<em>remarkable.</em>
		</h2>
		<p className="pf-contact__sub reveal-item">
			Have a project in mind? I&apos;d love to hear about it.
			<br />
			Let&apos;s create something amazing together.
		</p>
	</div>

	<div className="pf-contact__body">
		{/* Form */}
		<form className="pf-contact__form reveal-item" onSubmit={handleSubmit} noValidate>
			{sent ? (
				<div className="pf-contact__success">
					<svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
						<circle cx="20" cy="20" r="18" stroke="#34d399" strokeWidth="1.5" />
						<path d="M12 20l6 6 10-12" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<p>Message sent! I&apos;ll get back to you soon.</p>
				</div>
			) : (
				<>
					<div className="pf-contact__row">
						<div className="pf-contact__field">
							<label htmlFor="cf-name">Name</label>
							<input
								id="cf-name"
								name="name"
								type="text"
								placeholder="Your name"
								value={formState.name}
								onChange={handleChange}
								required
								autoComplete="name"
							/>
						</div>
						<div className="pf-contact__field">
							<label htmlFor="cf-email">Email</label>
							<input
								id="cf-email"
								name="email"
								type="email"
								placeholder="your@email.com"
								value={formState.email}
								onChange={handleChange}
								required
								autoComplete="email"
							/>
						</div>
					</div>
					<div className="pf-contact__field">
						<label htmlFor="cf-msg">Message</label>
						<textarea
							id="cf-msg"
							name="message"
							placeholder="Tell me about your project…"
							rows={5}
							value={formState.message}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="pf-contact__form-footer">
						<button
							ref={magnetRef}
							type="submit"
							className="pf-contact__submit"
							disabled={sending}
						>
							{sending ? (
								<span className="pf-contact__spinner" aria-hidden="true" />
							) : (
								<>
									<span>Send Message</span>
									<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
										<path d="M2 10h16M13 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</>
							)}
						</button>
					</div>
				</>
			)}
		</form>

		{/* Social links */}
		<div className="pf-contact__aside reveal-item">
			<p className="pf-contact__aside-title">Find me online</p>
			<ul className="pf-contact__socials">
				{SOCIAL.map(({ label, href, icon }) => (
					<li key={label}>
						<a href={href} className="pf-contact__social" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
							<span className="pf-contact__social-icon">{icon}</span>
							<span>{label}</span>
							<svg className="pf-contact__social-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
								<path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
							</svg>
						</a>
					</li>
				))}
			</ul>
			<div className="pf-contact__email-wrap">
				<p className="pf-contact__email-label">Direct email</p>
				<a href="mailto:hello@2taeyoon.com" className="pf-contact__email">
					hello@2taeyoon.com
				</a>
			</div>
		</div>
	</div>
</div>

<footer className="pf-footer">
	<p>© 2026 Taeyoon · Crafted with passion &amp; code</p>
	<a href="#hero" className="pf-footer__top">Back to top ↑</a>
</footer>
			</div>
    </section>
  );
}
