import AppHeader from "@/components/AppHeader";

const Overview = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#F9F8F4] text-[#1C1C1C] font-sans overflow-hidden selection:bg-[#E1F5FE] selection:text-[#0D9BDD]">

      {/* App Header */}
      <AppHeader />

      {/* Page Content (Overview) */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="overview-wrapper">
          <div className="overview-container">
              
              {/* Section 1: Editorial Header */}
              <header className="header-section">
                <h1>Alpha Home Services: CX & Intent</h1>
                <p className="framing-sentence">
                  A live view of customer trust and operational risk shaping Alpha's growth across Midwest markets.
                </p>
                <div className="provenance-cue">
                  <span>Updated 12 minutes ago</span>
                  <span>•</span>
                  <span>Seven active sources</span>
                  <span>•</span>
                  <span>2,847 signals analyzed</span>
                  <span>•</span>
                  <span>Q4 2024 – Present</span>
                </div>

                <div className="project-summary">
                  <p>
                    This intelligence layer synthesizes customer sentiment, service reliability signals, and brand perception data across Alpha's Midwest expansion markets. The analysis directly supports leadership's objective of preserving local trust equity while scaling corporate brand presence, a core strategic priority defined at project inception. Current findings reveal tension between operational consistency expectations and legacy brand loyalty, with clear implications for marketing messaging and service delivery standards in acquired territories.
                  </p>
                  <p style={{ marginTop: '16px' }}>
                    Across acquired service territories in Ohio, Indiana, and Michigan, customer feedback patterns indicate that brand transition timing significantly affects retention outcomes. Markets where legacy branding was preserved through the first 12 months of integration show measurably higher repeat purchase rates and stronger Net Promoter Scores compared to territories where corporate rebranding was introduced immediately. The data also highlights a growing correlation between technician certification visibility and booking conversion rates, particularly in emergency HVAC and plumbing categories where trust signals carry outsized influence on purchase decisions. These dynamics underscore the need for a phased brand architecture strategy that balances corporate scale advantages with the local credibility that Alpha's acquisition targets were originally valued for.
                  </p>
                </div>
              </header>

              {/* Section 2: Risk & Opportunity */}
              <section className="risk-opportunity-section">
                <div className="risk-opp-card risk-card">
                  <div className="risk-opp-header">
                    <span className="risk-opp-label risk-label">Risk</span>
                  </div>
                  <div className="risk-opp-statement">Reliability perception is driving negative sentiment in urgent service categories.</div>
                  <div className="risk-opp-support">No-show appointments and pricing inconsistency dominate recent complaints, threatening retention in core markets.</div>
                  <button className="risk-opp-action">Explore risk drivers →</button>
                </div>
                <div className="risk-opp-card opportunity-card">
                  <div className="risk-opp-header">
                    <span className="risk-opp-label opportunity-label">Opportunity</span>
                  </div>
                  <div className="risk-opp-statement">Local identity outperforms corporate branding in customer retention.</div>
                  <div className="risk-opp-support">Endorsement positioning ("Powered by Alpha") builds trust faster than replacement naming strategies.</div>
                  <button className="risk-opp-action">View opportunity analysis →</button>
                </div>
              </section>

              {/* Section 3: Key Learnings */}
              <section className="priorities-section">
                <div className="section-header">Key Learnings</div>

                <div className="priority-item">
                  <div className="priority-title">Protect local brand trust</div>
                  <div>
                    <div className="priority-meaning">Local identity is a stronger retention driver than promotions in core Midwest markets.</div>
                    <div className="next-move">Next Move: Preserve legacy naming in priority regions and attach certification proof points.</div>
                  </div>
                </div>

                <div className="priority-item">
                  <div className="priority-title">Fix reliability perception</div>
                  <div>
                    <div className="priority-meaning">Service consistency is becoming the leading purchase signal in urgent moments.</div>
                    <div className="next-move">Next Move: Surface technician certification and scheduling guarantees inside booking flows.</div>
                  </div>
                </div>

                <div className="priority-item">
                  <div className="priority-title">Use endorsement positioning</div>
                  <div>
                    <div className="priority-meaning">"Powered by Alpha" performs better as reassurance than replacement branding.</div>
                    <div className="next-move">Next Move: Deploy endorsement messaging in Ohio and Indiana and monitor sentiment.</div>
                  </div>
                </div>
              </section>

              {/* Section 4: Data Audit */}
              <section className="data-audit-section">
                <div className="section-header">Data Audit</div>

                <div className="audit-grid">
                  {[
                    { label: "Overall Health", score: 74, description: "Composite indicator across all dimensions showing moderate-to-strong analytical foundation." },
                    { label: "Quality", score: 82, description: "Source reliability and methodological rigor are strong with minor inconsistencies in older datasets." },
                    { label: "Quantity", score: 68, description: "Sufficient volume for core markets but thinner coverage in newly acquired Indiana territories." },
                    { label: "Relevance", score: 79, description: "High alignment with strategic objectives; some legacy data predates current brand transition focus." },
                    { label: "Credibility", score: 85, description: "Primary sources verified; third-party review data cross-referenced against direct customer feedback." },
                    { label: "Diversity", score: 61, description: "Over-indexed on review platforms; underrepresented in trade channels and competitor benchmarking." },
                    { label: "Freshness", score: 77, description: "Majority of signals within 90 days; scheduling complaint data refreshed within the last week." },
                  ].map((item) => (
                    <div key={item.label} className="audit-item">
                      <div className="audit-item-header">
                        <span className="audit-item-label">{item.label}</span>
                        <span className={`audit-item-score ${item.score >= 80 ? 'score-high' : item.score >= 65 ? 'score-mid' : 'score-low'}`}>
                          {item.score}
                        </span>
                      </div>
                      <div className="audit-bar-track">
                        <div
                          className={`audit-bar-fill ${item.score >= 80 ? 'fill-high' : item.score >= 65 ? 'fill-mid' : 'fill-low'}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <p className="audit-item-description">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>

        </div>
      </div>
    </div>
  </div>
  );
};

export default Overview;
