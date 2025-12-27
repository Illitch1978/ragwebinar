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
            <p className="pricing-desc">A complete diagnostic.<br />One clear view of performance.<br />Prioritised fixes.</p>
          </div>
          <div className="pricing-includes">
            <span className="includes-label">What it includes</span>
            <ul className="pricing-features">
              <li><CheckIcon /> Full site scan</li>
              <li><CheckIcon /> Key metrics and content analysis</li>
              <li><CheckIcon /> Competitor snapshot</li>
              <li><CheckIcon /> Shareable report</li>
            </ul>
          </div>
          <button className="pricing-btn primary">Get your report</button>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <h3>Monitor</h3>
            <div className="price">$49 <span className="period">per month</span></div>
            <p className="pricing-desc">See where you stand, what works, and what to change.</p>
          </div>
          <div className="pricing-includes">
            <span className="includes-label">What it includes</span>
            <ul className="pricing-features">
              <li><CheckIcon /> Live performance dashboard</li>
              <li><CheckIcon /> Score tracking over time</li>
              <li><CheckIcon /> Competitor and peer comparison</li>
              <li><CheckIcon /> Sector benchmarks and best practice</li>
              <li><CheckIcon /> AI consultant to pressure test decisions</li>
              <li><CheckIcon /> Messaging and positioning alignment checks</li>
              <li><CheckIcon /> Impact tracking as changes are made</li>
            </ul>
          </div>
          <button className="pricing-btn primary">Start monitoring</button>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
