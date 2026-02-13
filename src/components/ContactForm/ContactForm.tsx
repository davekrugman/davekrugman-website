'use client';

import { useState, type FormEvent } from 'react';
import styles from './ContactForm.module.css';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, inquiryType, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setInquiryType('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send message.');
    }
  }

  return (
    <div className={styles.contactLayout}>
      <div className={styles.contactInfo}>
        <h3>Let&apos;s create something together.</h3>
        <p>Available for commercial photography, editorial work, creative direction, and digital art collaborations. Based in New York City, working globally.</p>

        <div className={styles.contactDetail}>
          <div className={styles.contactDetailLabel}>Email</div>
          <div className={styles.contactDetailValue}>
            <a href="mailto:dave@davekrugman.com">dave@davekrugman.com</a>
          </div>
        </div>
        <div className={styles.contactDetail}>
          <div className={styles.contactDetailLabel}>Location</div>
          <div className={styles.contactDetailValue}>New York City, NY</div>
        </div>
        <div className={styles.contactDetail}>
          <div className={styles.contactDetailLabel}>Represented by</div>
          <div className={styles.contactDetailValue}>
            <a href="https://allships.co" target="_blank" rel="noopener noreferrer">ALLSHIPS</a>
          </div>
        </div>
      </div>

      {status === 'success' ? (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>Sent</div>
          <h4>Thanks for reaching out.</h4>
          <p>I&apos;ll get back to you soon.</p>
          <button
            className={styles.submitBtn}
            onClick={() => setStatus('idle')}
            type="button"
          >
            <span className={styles.submitBtnText}>&gt;&gt;&gt; Send Another</span>
          </button>
        </div>
      ) : (
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status === 'sending'}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'sending'}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Inquiry Type</label>
            <select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              required
              disabled={status === 'sending'}
            >
              <option value="" disabled>Select...</option>
              <option>Commercial Photography</option>
              <option>Editorial / Press</option>
              <option>Digital Art Collaboration</option>
              <option>Speaking / Events</option>
              <option>Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Message</label>
            <textarea
              placeholder="Tell me about your project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={status === 'sending'}
            />
          </div>

          {status === 'error' && (
            <div className={styles.errorMessage}>{errorMsg}</div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={status === 'sending'}
          >
            <span className={styles.submitBtnText}>
              {status === 'sending' ? '>>> Sending...' : '>>> Send Message'}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
