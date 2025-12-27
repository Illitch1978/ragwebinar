import React from 'react';
import { CheckIcon } from '../Icons';

function PricingSection() {
  return (
    <section className="pricing-section">
      <div className="section-header">
        <h2>Clear data. Strategic growth.</h2>
        <p className="section-desc">Whether you need a one-time diagnostic or a continuous improvement engine, we have a plan for your stage of growth.</p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card">
          <div className="pricing-header">
            <h3>Snapshot</h3>
            <div className="price">$149 <span className="period">one-time</span></div>
            <p className="price-meta">One site. One moment in time. No subscription.</p>
            <p className="pricing-desc">A single, comprehensive assessment that tells you exactly where your site stands and what to fix first.</p>
          </div>
          <ul className="pricing-features">
            <li><CheckIcon /> Expert diagnostic</li>
            <li><CheckIcon /> Decision-grade assessment</li>
            <li><CheckIcon /> Board-ready report (PDF)</li>
          </ul>
          <button className="pricing-btn secondary">Get Single Scan</button>
        </div>

        <div className="pricing-card popular">
          <div className="popular-badge">POPULAR</div>
          <div className="pricing-header">
            <h3>Improvement</h3>
            <div className="price">$49 <span className="period">/mo</span></div>
            <p className="price-meta">Billed quarterly. Cancel anytime.</p>
            <p className="pricing-desc">Ongoing insight and prioritisation so every change you make is intentional and measurable.</p>
          </div>
          <ul className="pricing-features">
            <li><CheckIcon /> <b>Track score evolution</b></li>
            <li><CheckIcon /> <b>Validate improvements</b></li>
            <li><CheckIcon /> <b>Benchmarking</b></li>
            <li><CheckIcon /> <b>Slack Alerts</b></li>
          </ul>
          <button className="pricing-btn primary">Start Free Trial</button>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <h3>Scale</h3>
            <div className="price">$99 <span className="period">/mo</span></div>
            <p className="price-meta">Per seat. Volume discounts available.</p>
            <p className="pricing-desc">A unified diagnostic framework for teams and agencies managing multiple websites.</p>
          </div>
          <ul className="pricing-features">
            <li><CheckIcon /> Client-facing credibility</li>
            <li><CheckIcon /> Repeatable framework</li>
            <li><CheckIcon /> White-label Reports</li>
          </ul>
          <button className="pricing-btn secondary">Contact Sales</button>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
