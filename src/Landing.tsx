import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing.css'

function Landing() {
  const navigate = useNavigate();
  const typeTargetRef = useRef<HTMLHeadingElement>(null);
  const xaiCounterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── CURSOR ── */
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      }
    };

    document.addEventListener('mousemove', onMouseMove);

    let rafId: number;
    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.transform = `translate(${Math.round(rx - 18)}px, ${Math.round(ry - 18)}px)`;
      }
      rafId = requestAnimationFrame(animRing);
    };
    animRing();

    /* ── PARTICLES ── */
    const pc = document.getElementById('particles');
    if (pc) {
      pc.innerHTML = ''; // Clear existing
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = -10 + 'px';
        p.style.animationDuration = (8 + Math.random() * 14) + 's';
        p.style.animationDelay = (Math.random() * 12) + 's';
        p.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
        p.style.width = p.style.height = (2 + Math.random() * 2) + 'px';
        pc.appendChild(p);
      }
    }

    /* ── FLOATING SKILL TAGS ── */
    const ft = document.getElementById('floatTags');
    const tagColors = [
      { bg: 'rgba(0,212,232,.12)', bdr: 'rgba(0,212,232,.35)', c: '#00d4e8' },
      { bg: 'rgba(155,107,255,.12)', bdr: 'rgba(155,107,255,.35)', c: '#9b6bff' },
      { bg: 'rgba(59,127,255,.12)', bdr: 'rgba(59,127,255,.35)', c: '#60a5fa' },
      { bg: 'rgba(52,211,153,.1)', bdr: 'rgba(52,211,153,.3)', c: '#34d399' }
    ];
    const tagSkills = ['Python', 'React', 'SQL', 'Docker', 'AWS', 'TypeScript', 'Kubernetes', 'Node.js', 'TensorFlow', 'MLOps', 'CI/CD', 'MongoDB', 'FastAPI', 'Next.js', 'GraphQL'];

    if (ft) {
      ft.innerHTML = '';
      tagSkills.forEach((sk, i) => {
        const t = document.createElement('div');
        t.className = 'float-tag';
        const col = tagColors[i % tagColors.length];
        t.style.cssText = `
          background: ${col.bg};
          border: 1px solid ${col.bdr};
          color: ${col.c};
          left: ${5 + Math.random() * 88}%;
          bottom: ${-40 + Math.random() * 20}px;
          animation-duration: ${10 + Math.random() * 12}s;
          animation-delay: ${Math.random() * 15}s;
        `;
        t.textContent = sk;
        ft.appendChild(t);
      });
    }

    /* ── SCROLL-BASED REVEAL ── */
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const delay = parseInt(el.dataset.delay || '0');
          setTimeout(() => el.classList.add('visible'), delay);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.feature-card,.step,.xai-mockup,.xai-text-side,.dag-visual').forEach(el => obs.observe(el));

    /* ── XAI BAR ANIMATION ── */
    let counterInterval: number;
    const xaiObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.xai-bar-fill').forEach(bar => {
            const b = bar as HTMLElement;
            b.style.width = (b.dataset.width || '0') + '%';
          });
          let n = 0;
          counterInterval = window.setInterval(() => {
            n = Math.min(n + 2, 87);
            if (xaiCounterRef.current) xaiCounterRef.current.textContent = n + '%';
            if (n >= 87) clearInterval(counterInterval);
          }, 20);
          xaiObs.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const xaiMock = document.getElementById('xaiMockup');
    if (xaiMock) xaiObs.observe(xaiMock);

    /* ── NAV SCROLL EFFECT ── */
    const handleScroll = () => {
      const nav = document.getElementById('landing-nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);

    /* ── TYPING EFFECT ── */
    const phrases = ['Dream Jobs', 'Your Future', 'New Heights', 'Real Results'];
    let pi = 0, ci = 0, deleting = false;
    let typeTimeout: number;

    const type = () => {
      const phrase = phrases[pi];
      if (!deleting) {
        if (typeTargetRef.current) typeTargetRef.current.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) {
          deleting = true;
          typeTimeout = window.setTimeout(type, 1800);
          return;
        }
      } else {
        if (typeTargetRef.current) typeTargetRef.current.textContent = phrase.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
      typeTimeout = window.setTimeout(type, deleting ? 55 : 95);
    };
    const initialTypeTimeout = window.setTimeout(type, 3000);

    /* ── SMOOTH BUTTON PULSE ── */
    const btns = document.querySelectorAll('.btn-primary');
    const onMouseDown = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transform = 'scale(.97) translateY(0)';
    };
    const onMouseUp = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transform = '';
    };

    btns.forEach(btn => {
      btn.addEventListener('mousedown', onMouseDown);
      btn.addEventListener('mouseup', onMouseUp);
    });

    /* ── CLEANUP ── */
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      clearInterval(counterInterval);
      clearTimeout(typeTimeout);
      clearTimeout(initialTypeTimeout);
      obs.disconnect();
      xaiObs.disconnect();
      btns.forEach(btn => {
        btn.removeEventListener('mousedown', onMouseDown);
        btn.removeEventListener('mouseup', onMouseUp);
      });
    };
  }, []);

  return (
    <div className="landing-page-container">
      {/* Custom cursor */}
      <div id="cursor-dot"></div>
      <div id="cursor-ring"></div>

      {/* Aurora background */}
      <div className="aurora">
        <div className="aurora-blob ab1"></div>
        <div className="aurora-blob ab2"></div>
        <div className="aurora-blob ab3"></div>
        <div className="aurora-blob ab4"></div>
      </div>

      {/* NAV */}
      <nav id="landing-nav">
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">✦</div>
          Career<span>Forge</span>
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#xai">AI Insights</a>
          <button className="btn-nav" onClick={() => navigate('/dashboard')}>Login</button>
          <button className="btn-nav" onClick={() => navigate('/login?role=mentor')}>Career Mentor</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="grid-lines"></div>
        <div className="particles" id="particles"></div>
        <div className="float-tags" id="floatTags"></div>
        <p className="hero-eyebrow">AI-Powered Career Intelligence</p>
        <h1 className="hero-title">
          Transform Your Skills into<br />
          <span className="gradient-word" id="typeTarget" ref={typeTargetRef}>Dream Jobs</span>
        </h1>
        <p className="hero-sub">
          Smart career guidance, skill analysis, and personalized learning paths — all powered by cutting-edge AI.
        </p>
        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Get Started <span className="arrow">→</span>
          </button>
          <a href="#how" className="btn-secondary">
            <span className="live-dot"></span>Watch demo
          </a>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* FEATURES */}
      <section id="features">
        <div className="section-head">
          <span className="section-eyebrow">Platform Features</span>
          <h2 className="section-title">Everything you need to <span className="hl-violet">level</span><span className="hl-cyan">up</span></h2>
        </div>
        <div className="features-grid">
          <div className="feature-card fc-cyan" data-delay="0">
            <div className="card-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
              </svg>
            </div>
            <svg className="card-corner-glow" viewBox="0 0 120 120">
              <circle cx="120" cy="0" r="80" fill="#00d4e8" />
            </svg>
            <h3 className="card-title">AI Career Recommendations</h3>
            <p className="card-desc">Get personalized career paths matched to your unique skill profile and aspirations — powered by XAI transparency.</p>
          </div>

          <div className="feature-card fc-violet" data-delay="80">
            <div className="card-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <svg className="card-corner-glow" viewBox="0 0 120 120">
              <circle cx="120" cy="0" r="80" fill="#9b6bff" />
            </svg>
            <h3 className="card-title">Skill Gap Analysis</h3>
            <p className="card-desc">Identify exactly which skills to develop for your target role with data-driven insights and priority rankings.</p>
          </div>

          <div className="feature-card fc-blue" data-delay="160">
            <div className="card-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
            </div>
            <svg className="card-corner-glow" viewBox="0 0 120 120">
              <circle cx="120" cy="0" r="80" fill="#3b7fff" />
            </svg>
            <h3 className="card-title">Dynamic Learning Roadmap</h3>
            <p className="card-desc">Auto-generated DAG-based learning plans that adapt as you grow — with critical path optimization and weekly scheduling.</p>
          </div>

          <div className="feature-card fc-teal" data-delay="240">
            <div className="card-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </div>
            <svg className="card-corner-glow" viewBox="0 0 120 120">
              <circle cx="120" cy="0" r="80" fill="#00b4cc" />
            </svg>
            <h3 className="card-title">AI Mock Interviews</h3>
            <p className="card-desc">Practice with realistic AI interviewers and receive instant actionable feedback with confidence scoring and keyword analysis.</p>
          </div>

          <div className="feature-card fc-green" data-delay="320">
            <div className="card-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <svg className="card-corner-glow" viewBox="0 0 120 120">
              <circle cx="120" cy="0" r="80" fill="#34d399" />
            </svg>
            <h3 className="card-title">Blockchain Credentials</h3>
            <p className="card-desc">Earn tamper-proof ERC-721 certificates stored on Polygon. Verified digital badges that showcase your competencies to employers.</p>
          </div>

          <div className="feature-card fc-amber" data-delay="400">
            <div className="card-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <svg className="card-corner-glow" viewBox="0 0 120 120">
              <circle cx="120" cy="0" r="80" fill="#fbbf24" />
            </svg>
            <h3 className="card-title">Real-Time Job Matching</h3>
            <p className="card-desc">Get matched to live opportunities that align with your skills and career goals — powered by live market demand data.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="section-head">
          <span className="section-eyebrow">The Process</span>
          <h2 className="section-title">From skills to <span className="hl-cyan">offer letter</span></h2>
        </div>
        <div className="steps-timeline">
          <div className="step" data-delay="0">
            <div className="step-num">1</div>
            <div className="step-body">
              <h3>Build your skill profile</h3>
              <p>Add your skills, education, interests, and projects. Paste your resume and let AI extract everything automatically.</p>
            </div>
          </div>
          <div className="step" data-delay="100">
            <div className="step-num">2</div>
            <div className="step-body">
              <h3>Discover your best-fit careers</h3>
              <p>Our XAI engine scores you across four weighted factors — skill match, market demand, interest alignment, and salary fit — with full transparency.</p>
            </div>
          </div>
          <div className="step" data-delay="200">
            <div className="step-num">3</div>
            <div className="step-body">
              <h3>Follow your DAG roadmap</h3>
              <p>Your personalized learning graph orders every skill by prerequisites, critical path, and hours. No guessing what to learn next.</p>
            </div>
          </div>
          <div className="step" data-delay="300">
            <div className="step-num">4</div>
            <div className="step-body">
              <h3>Ace the interview</h3>
              <p>Practice with role-specific AI interviews. Get scored on confidence, keyword coverage, and answer structure with instant feedback.</p>
            </div>
          </div>
          <div className="step" data-delay="400">
            <div className="step-num">5</div>
            <div className="step-body">
              <h3>Mint your verified credential</h3>
              <p>Earn a blockchain certificate for every skill mastered. Share a tamper-proof token that any employer can verify on-chain in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* XAI SECTION */}
      <section id="xai">
        <div className="xai-inner">
          <div className="xai-mockup" id="xaiMockup">
            <div className="xai-tag">Explainable AI</div>
            <div className="xai-role">Why Data Scientist? <span style={{ color: 'var(--cyan)', fontFamily: 'var(--ff-head)' }}>87%</span></div>
            <div className="xai-factor">
              <div className="xai-factor-head">
                <span className="name">⚡ Skill Match</span>
                <span className="val">92% × 45% weight=41 pts</span>
              </div>
              <div className="xai-bar-track">
                <div className="xai-bar-fill" data-width="92" style={{ background: 'linear-gradient(90deg,var(--cyan),var(--blue))' }}></div>
              </div>
            </div>
            <div className="xai-factor">
              <div className="xai-factor-head">
                <span className="name">📈 Market Demand</span>
                <span className="val">95% × 20% weight=19 pts</span>
              </div>
              <div className="xai-bar-track">
                <div className="xai-bar-fill" data-width="95" style={{ background: 'linear-gradient(90deg,var(--violet),#ff6ef7)' }}></div>
              </div>
            </div>
            <div className="xai-factor">
              <div className="xai-factor-head">
                <span className="name">❤️ Interest Alignment</span>
                <span className="val">78% × 20% weight=16 pts</span>
              </div>
              <div className="xai-bar-track">
                <div className="xai-bar-fill" data-width="78" style={{ background: 'linear-gradient(90deg,#ff6ef7,var(--violet))' }}></div>
              </div>
            </div>
            <div className="xai-factor">
              <div className="xai-factor-head">
                <span className="name">💰 Salary Potential</span>
                <span className="val">82% × 15% weight=12 pts</span>
              </div>
              <div className="xai-bar-track">
                <div className="xai-bar-fill" data-width="82" style={{ background: 'linear-gradient(90deg,#fbbf24,#f97316)' }}></div>
              </div>
            </div>
            <div className="xai-score-big">
              <div>
                <div className="label">Composite XAI score</div>
                <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '2px' }}>Weighted across 4 dimensions</div>
              </div>
              <div className="num" id="xaiCounter" ref={xaiCounterRef}>0%</div>
            </div>
          </div>

          <div className="xai-text-side" id="xaiText">
            <span className="section-eyebrow" style={{ textAlign: 'left', display: 'block', marginBottom: '1rem' }}>Explainable AI</span>
            <h2>We show you <em style={{ color: 'var(--violet)', fontStyle: 'normal' }}>exactly why</em> each career was recommended</h2>
            <p>No black boxes. Every recommendation is broken down into four weighted factors so you understand the reasoning, not just the result.</p>
            <ul className="xai-bullets">
              <li>Skill match score across all required and optional skills</li>
              <li>Live market demand data from 8-month trend analysis</li>
              <li>Interest alignment computed from your profile keywords</li>
              <li>Salary potential normalized against ₹140k benchmark</li>
              <li>Full factor weights visible and auditable — always</li>
            </ul>
          </div>
        </div>
      </section>

      {/* DAG PREVIEW */}
      <section id="dag-preview">
        <div className="dag-showcase">
          <div className="section-head">
            <span className="section-eyebrow">Roadmap Technology</span>
            <h2 className="section-title">Your learning path, <span className="hl-cyan">computed</span> not guessed</h2>
            <p style={{ color: 'var(--muted)', marginTop: '1rem', fontWeight: 300, maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
              A directed acyclic graph orders every skill by prerequisites. Critical Path Method finds the fastest route to job-ready.
            </p>
          </div>
          <div className="dag-visual" id="dagVisual">
            <svg width="100%" viewBox="0 0 900 300" style={{ display: 'block' }}>
              <defs>
                <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" />
                </marker>
              </defs>
              <path d="M80,60 C80,95 180,95 180,130" fill="none" stroke="#f59e0b" strokeWidth="1.8" markerEnd="url(#ah)" />
              <path d="M80,60 C80,55 280,55 280,50" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#ah)" />
              <path d="M260,145 C310,145 350,145 360,145" fill="none" stroke="#f59e0b" strokeWidth="1.8" markerEnd="url(#ah)" />
              <path d="M460,145 C510,145 550,145 560,145" fill="none" stroke="#f59e0b" strokeWidth="1.8" markerEnd="url(#ah)" />
              <path d="M360,65 C420,65 500,110 560,130" fill="none" stroke="#f59e0b" strokeWidth="1.8" markerEnd="url(#ah)" />
              <path d="M360,65 C420,65 460,210 460,230" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#ah)" />
              <path d="M360,225 C420,225 460,250 560,250" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#ah)" />
              <path d="M660,145 C730,145 780,145 780,145" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ah)" />
              <path d="M660,145 C700,160 750,195 780,200" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#ah)" />

              <g className="dag-node">
                <rect x="20" y="35" width="120" height="50" rx="14" fill="rgba(71,85,105,.35)" stroke="rgba(71,85,105,.6)" strokeWidth="1" />
                <text x="80" y="66" textAnchor="middle" dominantBaseline="central" fontFamily="Syne,sans-serif" fontSize="12" fontWeight="700" fill="#94a3b8">You (start)</text>
              </g>
              <g className="dag-node">
                <rect x="140" y="120" width="120" height="50" rx="10" fill="rgba(99,102,241,.15)" stroke="rgba(99,102,241,.4)" strokeWidth="1" />
                <text x="200" y="145" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#818cf8">Math</text>
                <text x="200" y="160" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="9" fill="#64748b">Foundations</text>
              </g>
              <g className="dag-node">
                <rect x="260" y="40" width="100" height="50" rx="10" fill="rgba(251,191,36,.12)" stroke="rgba(251,191,36,.5)" strokeWidth="1.5" />
                <text x="310" y="65" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="11" fontWeight="600" fill="#fbbf24">Python ⚡</text>
                <text x="310" y="79" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="8" fill="#64748b">critical path</text>
              </g>
              <g className="dag-node">
                <rect x="360" y="120" width="100" height="50" rx="10" fill="rgba(251,191,36,.12)" stroke="rgba(251,191,36,.5)" strokeWidth="1.5" />
                <text x="410" y="145" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="11" fontWeight="600" fill="#fbbf24">Statistics ⚡</text>
                <text x="410" y="159" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="8" fill="#64748b">critical path</text>
              </g>
              <g className="dag-node">
                <rect x="260" y="200" width="100" height="50" rx="10" fill="rgba(16,185,129,.1)" stroke="rgba(16,185,129,.45)" strokeWidth="1" />
                <text x="310" y="225" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#34d399">SQL ✓</text>
                <text x="310" y="239" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="8" fill="#059669">owned</text>
              </g>
              <g className="dag-node">
                <rect x="400" y="210" width="100" height="50" rx="10" fill="rgba(59,127,255,.12)" stroke="rgba(59,127,255,.3)" strokeWidth="1" />
                <text x="450" y="235" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#60a5fa">FastAPI</text>
                <text x="450" y="249" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="8" fill="#64748b">optional</text>
              </g>
              <g className="dag-node">
                <rect x="560" y="120" width="100" height="50" rx="10" fill="rgba(251,191,36,.14)" stroke="#f59e0b" strokeWidth="2" />
                <text x="610" y="143" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="11" fontWeight="700" fill="#fbbf24">Machine ⚡</text>
                <text x="610" y="158" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="11" fontWeight="700" fill="#fbbf24">Learning</text>
              </g>
              <g className="dag-node">
                <rect x="540" y="230" width="120" height="50" rx="10" fill="rgba(236,72,153,.1)" stroke="rgba(236,72,153,.3)" strokeWidth="1" />
                <text x="600" y="255" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#f472b6">Deep Learning</text>
              </g>
              <g className="dag-node">
                <rect x="760" y="120" width="120" height="60" rx="20" fill="rgba(0,212,232,.1)" stroke="var(--cyan)" strokeWidth="2" />
                <text x="820" y="145" textAnchor="middle" dominantBaseline="central" fontFamily="Syne,sans-serif" fontSize="12" fontWeight="700" fill="#00d4e8">Data</text>
                <text x="820" y="163" textAnchor="middle" dominantBaseline="central" fontFamily="Syne,sans-serif" fontSize="12" fontWeight="700" fill="#00d4e8">Scientist 🧬</text>
              </g>

              <line x1="20" y1="285" x2="50" y2="285" stroke="#f59e0b" strokeWidth="2" />
              <text x="55" y="289" fontFamily="DM Sans,sans-serif" fontSize="9" fill="#64748b">Critical path</text>
              <line x1="140" y1="285" x2="170" y2="285" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />
              <text x="175" y="289" fontFamily="DM Sans,sans-serif" fontSize="9" fill="#64748b">Dependency</text>
              <rect x="255" y="280" width="8" height="8" rx="2" fill="rgba(16,185,129,.3)" stroke="rgba(16,185,129,.5)" strokeWidth="1" />
              <text x="268" y="289" fontFamily="DM Sans,sans-serif" fontSize="9" fill="#64748b">Owned skill</text>
            </svg>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.82rem' }}>
                <span style={{ color: 'var(--muted)' }}>Nodes:</span>
                <span style={{ color: 'var(--text)', fontWeight: 600, fontFamily: 'var(--ff-head)' }}>9</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.82rem' }}>
                <span style={{ color: 'var(--muted)' }}>Edges:</span>
                <span style={{ color: 'var(--text)', fontWeight: 600, fontFamily: 'var(--ff-head)' }}>8</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.82rem' }}>
                <span style={{ color: 'var(--muted)' }}>Critical path:</span>
                <span style={{ color: '#fbbf24', fontWeight: 600, fontFamily: 'var(--ff-head)' }}>4 nodes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.82rem' }}>
                <span style={{ color: 'var(--muted)' }}>Est. duration:</span>
                <span style={{ color: 'var(--cyan)', fontWeight: 600, fontFamily: 'var(--ff-head)' }}>~120h</span>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'var(--muted)' }}>
                Kahn's topological sort · CPM critical path · DFS cycle detection
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="cta">
        <div className="cta-glow"></div>
        <div className="cta-box" id="ctaBox">
          <span className="badge badge-cyan" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            <span className="live-dot"></span>Free to start
          </span>
          <h2>Ready to forge your<br />
            <span style={{ background: 'linear-gradient(100deg,var(--cyan),var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              dream career?
            </span>
          </h2>
          <p>Join thousands of professionals who used CareerForge to land roles they love — faster than they thought possible.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ fontSize: '1rem', padding: '16px 40px' }} onClick={() => navigate('/dashboard')}>
              Start for free <span className="arrow">→</span>
            </button>
            <a href="#features" className="btn-secondary">Explore features</a>
          </div>
          <p style={{ marginTop: '1.5rem', color: 'var(--muted)', fontSize: '.8rem' }}>No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="landing-footer">
        <div className="logo">Career<span>Forge</span><span style={{ color: 'var(--muted)', fontWeight: 300, marginLeft: '8px', fontFamily: 'var(--ff-body)', fontSize: '.75rem' }}>AI Career Intelligence</span></div>
        <p>© 2025 CareerForge. All rights reserved.</p>
        <nav>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">GitHub</a>
          <a href="#">Docs</a>
        </nav>
      </footer>
    </div>
  )
}

export default Landing
