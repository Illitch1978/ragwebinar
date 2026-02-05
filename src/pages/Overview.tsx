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
                <h1>Atrium Home Services: CX & Intent</h1>
                <p className="framing-sentence">
                  A live view of customer trust and operational risk shaping Atrium's growth across Midwest markets.
                </p>
                <div className="provenance-cue">
                  <span>Updated 12 minutes ago</span>
                  <span>•</span>
                  <span>Seven active sources</span>
                  <span>•</span>
                  <span>High confidence</span>
                  <span>•</span>
                  <span>Full traceability</span>
                </div>

                <div className="project-summary">
                  <p>
                    This intelligence layer synthesizes customer sentiment, service reliability signals, and brand perception data across Atrium's Midwest expansion markets. The analysis directly supports leadership's objective of preserving local trust equity while scaling corporate brand presence—a core strategic priority defined at project inception. Current findings reveal tension between operational consistency expectations and legacy brand loyalty, with clear implications for marketing messaging and service delivery standards in acquired territories.
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
                  <div className="risk-opp-support">Endorsement positioning ("Powered by Atrium") builds trust faster than replacement naming strategies.</div>
                  <button className="risk-opp-action">View opportunity analysis →</button>
                </div>
              </section>

              {/* Section 3: Current Priorities */}
              <section className="priorities-section">
                <div className="section-header">Strategic Priorities</div>

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
                    <div className="priority-meaning">"Powered by Atrium" performs better as reassurance than replacement branding.</div>
                    <div className="next-move">Next Move: Deploy endorsement messaging in Ohio and Indiana and monitor sentiment.</div>
                  </div>
                </div>
              </section>

              {/* Section 4: Action Board (Links) */}
              <section className="action-board">
                <div className="section-header">Recommended Actions</div>
                <p className="section-cue">Based on current signals</p>

                <div className="action-list">
                  <div className="action-item">
                    <span className="action-link">Generate executive summary</span>
                    <div className="action-description">
                      Prepare a C-suite briefing on trust and branding performance across Midwest markets.
                    </div>
                  </div>

                  <div className="action-item">
                    <span className="action-link">Run data audit</span>
                    <div className="action-description">
                      Verify source balance to ensure operational logs aren't overpowering direct customer feedback.
                    </div>
                  </div>

                  <div className="action-item">
                    <span className="action-link">Explore churn risk drivers</span>
                    <div className="action-description">
                      Isolate negative sentiment correlating with cancellations, specifically no-shows and pricing.
                    </div>
                  </div>

                  <div className="action-item">
                    <span className="action-link">Talk to data</span>
                    <div className="action-description">
                      Interrogate the intelligence layer directly to uncover nuanced patterns in reliability clusters.
                    </div>
                  </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  </div>
  );
};

export default Overview;
