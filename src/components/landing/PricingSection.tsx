import React from 'react';
import { CheckIcon } from '../Icons';

function PricingSection() {
  return (
    <section className="pricing-section">
      <div className="section-header">
        <h2>Clear data. Strategic growth.</h2>
        <p className="section-desc">Whether you need a one-time diagnostic or continuous improvement guidance, we have you covered.</p>
      </div>

      <div className="pricing-grid two-col">
        <div className="pricing-card">
          <div className="pricing-header">
            <h3>Scan</h3>
            <div className="price">$149 <span className="period">one-time</span></div>
            <p className="pricing-desc">A complete diagnostic. One clear score. Prioritised fixes.</p>
          </div>
          <div className="pricing-includes">
            <span className="includes-label">What it includes</span>
            <ul className="pricing-features">
              <li><CheckIcon /> Full site scan</li>
              <li><CheckIcon /> Confidence score</li>
              <li><CheckIcon /> Competitor snapshot</li>
              <li><CheckIcon /> Shareable report</li>
            </ul>
          </div>
          <button className="pricing-btn primary">Get Your Score</button>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <h3>Monitor</h3>
            <div className="price">$49 <span className="period">/month</span></div>
            <p className="pricing-desc">Ongoing insight and improvement guidance.</p>
          </div>
          <div className="pricing-includes">
            <span className="includes-label">What it includes</span>
            <ul className="pricing-features">
              <li><CheckIcon /> Live dashboard</li>
              <li><CheckIcon /> Score tracking over time</li>
              <li><CheckIcon /> Competitor tracking</li>
              <li><CheckIcon /> Sector benchmarks and best practice</li>
              <li><CheckIcon /> AI consultant to guide improvements</li>
            </ul>
          </div>
          <button className="pricing-btn primary">Start Monitoring</button>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
