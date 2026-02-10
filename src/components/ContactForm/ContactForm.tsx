'use client';

import styles from './ContactForm.module.css';

export default function ContactForm() {
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

      <form className={styles.contactForm}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input type="text" placeholder="Your name" />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" placeholder="your@email.com" />
        </div>
        <div className={styles.formGroup}>
          <label>Inquiry Type</label>
          <select defaultValue="">
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
          <textarea placeholder="Tell me about your project..."></textarea>
        </div>
        <button type="submit" className={styles.submitBtn}>
          <span className={styles.submitBtnText}>&gt;&gt;&gt; Send Message</span>
        </button>
      </form>
    </div>
  );
}
