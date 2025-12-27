import React from 'react';
import { ArrowRightIcon } from '../Icons';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo">mondro<span className="dot"></span></div>
          <p>See how good your website really is.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Enterprise</a>
            <a href="#">Roadmap</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">Blog</a>
            <a href="#">Case Studies</a>
            <a href="#">Documentation</a>
            <a href="#">Help Center</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Legal</a>
            <a href="#">Contact</a>
          </div>
        </div>

        <div className="footer-cta">
          <h4>Stay updated</h4>
          <p>Get the latest insights on AI and web performance.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Email address" />
            <button><ArrowRightIcon /></button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#" className="social-link">X</a>
          <a href="#" className="social-link">LinkedIn</a>
        </div>
        <p className="copyright">© 2025 Mondro Inc.</p>
      </div>
    </footer>
  );
}

export default Footer;
