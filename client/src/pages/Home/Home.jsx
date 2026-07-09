import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="homepage-container">
      {/* HEADER / NAVIGATION BAR */}
      <header className={`homepage-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
            <div className="logo-icon-wrapper">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <span className="logo-text">SMS</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <a href="#hero" className="nav-link-item">Home</a>
            <a href="#about" className="nav-link-item">About</a>
            <a href="#features" className="nav-link-item">Features</a>
            <a href="#stats" className="nav-link-item">Courses</a>
            <a href="#contact" className="nav-link-item">Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className="nav-actions">
            <Link to="/login" className="btn-nav btn-nav-login">Login</Link>
            <Link to="/register" className="btn-nav btn-nav-register">Register</Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className={`mobile-nav-toggle ${mobileMenuOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav-links">
            <a href="#hero" className="mobile-nav-link" onClick={closeMobileMenu}>Home</a>
            <a href="#about" className="mobile-nav-link" onClick={closeMobileMenu}>About</a>
            <a href="#features" className="mobile-nav-link" onClick={closeMobileMenu}>Features</a>
            <a href="#stats" className="mobile-nav-link" onClick={closeMobileMenu}>Courses</a>
            <a href="#contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</a>
            <div className="mobile-nav-divider"></div>
            <Link to="/login" className="mobile-nav-btn mobile-btn-login" onClick={closeMobileMenu}>Login</Link>
            <Link to="/register" className="mobile-nav-btn mobile-btn-register" onClick={closeMobileMenu}>Register</Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="section-container hero-container">
          <div className="hero-content">
            <div className="hero-tag">
              <span className="tag-dot"></span>
              <span className="tag-text">Next-Generation Education Portal</span>
            </div>
            <h1 className="hero-title animate-fade-in-up">
              Welcome to <span className="highlight-text">Student Management</span> System
            </h1>
            <p className="hero-subtitle">
              Manage students, teachers, courses, attendance, and results efficiently. An all-in-one platform for modern schools and universities.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-hero btn-hero-primary">
                Get Started <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <a href="#about" className="btn-hero btn-hero-secondary">
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-illustration">
            {/* Elegant Vector SVG Illustration */}
            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-illustration">
              {/* Outer Glow */}
              <circle cx="250" cy="250" r="180" fill="url(#heroGlowGrad)" opacity="0.6" />
              {/* Decorative elements */}
              <circle cx="90" cy="110" r="12" fill="#3b82f6" opacity="0.4" className="floating-dot-1" />
              <circle cx="410" cy="380" r="8" fill="#60a5fa" opacity="0.5" className="floating-dot-2" />
              <rect x="380" y="100" width="24" height="24" rx="6" transform="rotate(45 380 100)" fill="#93c5fd" opacity="0.3" className="floating-rect" />
              
              {/* Laptop Base */}
              <path d="M70 360 H430 C440 360, 440 380, 430 380 H70 C60 380, 60 360, 70 360 Z" fill="#94a3b8" />
              <path d="M210 380 H290 V388 C290 392, 210 392, 210 388 Z" fill="#64748b" />
              
              {/* Laptop Screen / Dashboard */}
              <rect x="98" y="130" width="304" height="220" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="6" />
              <rect x="98" y="130" width="304" height="40" rx="12" fill="#f1f5f9" />
              <circle cx="118" cy="150" r="6" fill="#ef4444" />
              <circle cx="134" cy="150" r="6" fill="#eab308" />
              <circle cx="150" cy="150" r="6" fill="#22c55e" />
              
              {/* Dashboard Content Mockup */}
              <rect x="115" y="190" width="60" height="50" rx="6" fill="#dbeafe" />
              <circle cx="145" cy="210" r="12" fill="#3b82f6" opacity="0.7" />
              <rect x="115" y="250" width="60" height="8" rx="4" fill="#93c5fd" />
              <rect x="115" y="265" width="45" height="8" rx="4" fill="#e2e8f0" />

              <rect x="190" y="190" width="195" height="40" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="205" y="202" width="60" height="8" rx="4" fill="#cbd5e1" />
              <rect x="205" y="214" width="100" height="6" rx="3" fill="#cbd5e1" opacity="0.5" />
              <circle cx="355" cy="210" r="10" fill="#22c55e" opacity="0.2" />
              <path d="M351 210 L354 213 L359 207" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />

              <rect x="190" y="240" width="90" height="85" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              <circle cx="235" cy="275" r="20" fill="url(#circleChartGrad)" />
              <rect x="205" y="308" width="60" height="6" rx="3" fill="#cbd5e1" />

              <rect x="295" y="240" width="90" height="85" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              <path d="M305 310 L320 280 L335 295 L350 260 L365 275 L375 250" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="310" y="308" width="60" height="6" rx="3" fill="#cbd5e1" />

              {/* Graduation Cap floating */}
              <g className="floating-cap">
                <path d="M340 70 L400 45 L460 70 L400 95 Z" fill="#1e3a8a" />
                <path d="M365 78 V100 C365 110, 435 110, 435 100 V78" fill="#1e40af" />
                <path d="M400 95 L400 135" stroke="#ef4444" strokeWidth="3" />
                <rect x="394" y="132" width="12" height="15" rx="2" fill="#ef4444" />
                <circle cx="400" cy="95" r="4" fill="#f59e0b" />
              </g>

              {/* Stack of books next to laptop */}
              <g className="books-stack">
                <path d="M60 300 H120 V325 H60 Z" fill="#f43f5e" />
                <path d="M120 300 H125 V325 H120 Z" fill="#e2e8f0" />
                <path d="M58 315 H122 V325 H58 Z" fill="#be123c" />

                <path d="M50 325 H115 V348 H50 Z" fill="#0284c7" />
                <path d="M115 325 H120 V348 H115 Z" fill="#e2e8f0" />
                <path d="M48 338 H117 V348 H48 Z" fill="#0369a1" />

                <path d="M40 348 H110 V368 H40 Z" fill="#10b981" />
                <path d="M110 348 H115 V368 H110 Z" fill="#e2e8f0" />
                <path d="M38 358 H112 V368 H38 Z" fill="#047857" />
              </g>

              {/* Gradients */}
              <defs>
                <radialGradient id="heroGlowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="circleChartGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-subtitle">System Capabilities</span>
            <h2 className="section-title">Powerful Features Built For You</h2>
            <div className="section-divider"></div>
            <p className="section-desc">
              Explore the vital components that make our platform the most comprehensive and modern management system available today.
            </p>
          </div>

          <div className="features-grid">
            {/* Card 1: Student Registration */}
            <div className="feature-card animate-lift">
              <div className="feature-icon-box card-icon-1">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <h3 className="feature-card-title">Student Registration</h3>
              <p className="feature-card-text">
                Quick, seamless onboarding for new students with digitized record keeping and parent contact linkage.
              </p>
            </div>

            {/* Card 2: Attendance Management */}
            <div className="feature-card animate-lift">
              <div className="feature-icon-box card-icon-2">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <h3 className="feature-card-title">Attendance Management</h3>
              <p className="feature-card-text">
                Real-time tracking of daily attendance with instant reports and automated parent notifications.
              </p>
            </div>

            {/* Card 3: Course Management */}
            <div className="feature-card animate-lift">
              <div className="feature-icon-box card-icon-3">
                <i className="fa-solid fa-book-open"></i>
              </div>
              <h3 className="feature-card-title">Course Management</h3>
              <p className="feature-card-text">
                Easily configure syllabus structures, assign professors, map resources, and manage curriculum updates.
              </p>
            </div>

            {/* Card 4: Teacher Management */}
            <div className="feature-card animate-lift">
              <div className="feature-icon-box card-icon-4">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <h3 className="feature-card-title">Teacher Management</h3>
              <p className="feature-card-text">
                Profile records, specialized departments assignment, timetables scheduling, and lecture mappings.
              </p>
            </div>

            {/* Card 5: Online Results */}
            <div className="feature-card animate-lift">
              <div className="feature-icon-box card-icon-5">
                <i className="fa-solid fa-award"></i>
              </div>
              <h3 className="feature-card-title">Online Results</h3>
              <p className="feature-card-text">
                Enter exam marks securely and instantly compile report cards, grading metrics, and class rankings.
              </p>
            </div>

            {/* Card 6: Secure Login */}
            <div className="feature-card animate-lift">
              <div className="feature-icon-box card-icon-6">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="feature-card-title">Secure Login</h3>
              <p className="feature-card-text">
                Protected authentication layouts, role-based dashboard filters, and encrypted data transfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="about-section">
        <div className="section-container about-container">
          <div className="about-illustration">
            {/* Premium Workspace Vector SVG */}
            <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-illustration">
              <rect width="100%" height="100%" fill="transparent" />
              <rect x="50" y="320" width="400" height="20" rx="10" fill="#e2e8f0" />
              <rect x="80" y="60" width="340" height="260" rx="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
              {/* Title bar of the mockup window */}
              <rect x="80" y="60" width="340" height="36" rx="16" fill="#3b82f6" />
              <rect x="80" y="80" width="340" height="16" fill="#3b82f6" />
              <circle cx="105" cy="78" r="5" fill="#ef4444" />
              <circle cx="120" cy="78" r="5" fill="#eab308" />
              <circle cx="135" cy="78" r="5" fill="#22c55e" />
              <rect x="180" y="72" width="140" height="12" rx="6" fill="#1d4ed8" />

              {/* Screen Mockup Inner Content */}
              {/* Sidebar inside mockup */}
              <rect x="95" y="110" width="80" height="190" rx="8" fill="#e2e8f0" />
              <rect x="105" y="125" width="60" height="8" rx="4" fill="#94a3b8" />
              <rect x="105" y="145" width="60" height="6" rx="3" fill="#cbd5e1" />
              <rect x="105" y="160" width="60" height="6" rx="3" fill="#cbd5e1" />
              <rect x="105" y="175" width="60" height="6" rx="3" fill="#cbd5e1" />
              <rect x="105" y="190" width="60" height="6" rx="3" fill="#cbd5e1" />

              {/* Main panel */}
              <rect x="190" y="110" width="215" height="65" rx="8" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
              <circle cx="225" cy="142" r="18" fill="#3b82f6" opacity="0.2" />
              <path d="M220 142 L224 146 L232 138" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="255" y="130" width="100" height="10" rx="5" fill="#3b82f6" />
              <rect x="255" y="146" width="60" height="6" rx="3" fill="#93c5fd" />

              {/* Grid cards in mockup */}
              <rect x="190" y="185" width="100" height="50" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="202" y="198" width="50" height="8" rx="4" fill="#cbd5e1" />
              <rect x="202" y="212" width="75" height="6" rx="3" fill="#e2e8f0" />

              <rect x="305" y="185" width="100" height="50" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="317" y="198" width="50" height="8" rx="4" fill="#cbd5e1" />
              <rect x="317" y="212" width="75" height="6" rx="3" fill="#e2e8f0" />

              <rect x="190" y="245" width="215" height="55" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="205" y="258" width="80" height="8" rx="4" fill="#64748b" />
              <rect x="205" y="272" width="180" height="6" rx="3" fill="#e2e8f0" />
              <rect x="205" y="283" width="130" height="6" rx="3" fill="#e2e8f0" />

              {/* Decorative floating analytics gear */}
              <g className="floating-gear">
                <circle cx="410" cy="180" r="22" fill="#dbeafe" opacity="0.8" />
                <path d="M410 166 L410 194 M396 180 L424 180 M400 170 L420 190 M400 190 L420 170" stroke="#3b82f6" strokeWidth="4" />
                <circle cx="410" cy="180" r="10" fill="#ffffff" />
              </g>

              {/* Floating Shield */}
              <g className="floating-shield">
                <path d="M60 210 C60 190, 85 180, 85 180 C85 180, 110 190, 110 210 C110 230, 85 245, 85 245 C85 245, 60 230, 60 210 Z" fill="#10b981" />
                <path d="M85 185 L85 240 M70 210 L100 210" stroke="#ffffff" strokeWidth="2" opacity="0.3" />
              </g>
            </svg>
          </div>

          <div className="about-content">
            <span className="section-subtitle text-left">Who We Are</span>
            <h2 className="section-title">Designed For Seamless Educational Management</h2>
            <div className="section-divider align-left"></div>
            <p className="about-text">
              The **Student Management System** is a state-of-the-art educational ERP application designed to bridge the gap between administrators, teachers, parents, and students. By automating core administrative operations, we empower educators to focus on what truly matters—enriching student learning and success.
            </p>
            <p className="about-text">
              Our secure, role-based platform offers dynamic attendance tracking, seamless grading systems, robust timetable management, and automated alerts. Whether on a desktop computer, a tablet, or a mobile phone, stay connected to your educational workspace, anywhere and at any time.
            </p>
            <div className="about-features-list">
              <div className="about-feature-item">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <span>Responsive interface compatible with any screen size.</span>
              </div>
              <div className="about-feature-item">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <span>Encrypted role-based routes for absolute data privacy.</span>
              </div>
              <div className="about-feature-item">
                <div className="about-feature-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <span>High-performance components ensuring near-zero delay loading.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section id="stats" className="stats-section">
        <div className="section-container stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <i className="fa-solid fa-user-graduate"></i>
            </div>
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Students Enrolled</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <div className="stat-number">500+</div>
            <div className="stat-label">Expert Faculty</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <i className="fa-solid fa-book-atlas"></i>
            </div>
            <div className="stat-number">200+</div>
            <div className="stat-label">Modern Courses</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div className="stat-number">98%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-subtitle">Student Testimonials</span>
            <h2 className="section-title">What Our Students Say</h2>
            <div className="section-divider"></div>
            <p className="section-desc">
              Don't just take our word for it. Hear directly from our students who manage their daily schedules and results through our system.
            </p>
          </div>

          <div className="testimonials-grid">
            {/* Card 1 */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="testimonial-text">
                "Checking my exam schedules, viewing attendance sheets, and receiving immediate notice uploads has never been easier. The dashboard is fast, simple, and clean."
              </p>
              <div className="testimonial-user">
                <div className="user-avatar avatar-bg-1">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="url(#userGrad1)" />
                    {/* User profile outline */}
                    <circle cx="50" cy="40" r="18" fill="#ffffff" />
                    <path d="M22 80 C22 62, 35 55, 50 55 C65 55, 78 62, 78 80 Z" fill="#ffffff" />
                    <defs>
                      <linearGradient id="userGrad1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="user-info">
                  <h4 className="user-name">Sarah Jenkins</h4>
                  <p className="user-role">Computer Science Student</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="testimonial-text">
                "As a faculty member, updating attendance takes me less than 20 seconds. Publishing grade sheets and online results is completely streamlined."
              </p>
              <div className="testimonial-user">
                <div className="user-avatar avatar-bg-2">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="url(#userGrad2)" />
                    <circle cx="50" cy="40" r="18" fill="#ffffff" />
                    <path d="M22 80 C22 62, 35 55, 50 55 C65 55, 78 62, 78 80 Z" fill="#ffffff" />
                    <defs>
                      <linearGradient id="userGrad2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="user-info">
                  <h4 className="user-name">Prof. Marcus Vance</h4>
                  <p className="user-role">Senior Lecturer, Physics</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star-half-stroke"></i>
              </div>
              <p className="testimonial-text">
                "Our administrative workflows have dropped in completion time by over 45%. Fee collections, noticeboard publications, and database queries are fully secured."
              </p>
              <div className="testimonial-user">
                <div className="user-avatar avatar-bg-3">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="url(#userGrad3)" />
                    <circle cx="50" cy="40" r="18" fill="#ffffff" />
                    <path d="M22 80 C22 62, 35 55, 50 55 C65 55, 78 62, 78 80 Z" fill="#ffffff" />
                    <defs>
                      <linearGradient id="userGrad3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="user-info">
                  <h4 className="user-name">Clarissa Hayes</h4>
                  <p className="user-role">Lead Academic Coordinator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section">
        <div className="cta-gradient-overlay"></div>
        <div className="section-container cta-container text-center">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-desc">
            Empower your institution, streamline your administrative workflows, and keep students connected to class schedules and academic updates in one centralized space.
          </p>
          <Link to="/register" className="btn-cta">
            Register Now <i className="fa-solid fa-user-plus"></i>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="homepage-footer">
        <div className="section-container footer-grid">
          {/* Column 1: About */}
          <div className="footer-col footer-col-about">
            <div className="footer-logo">
              <i className="fa-solid fa-graduation-cap"></i>
              <span>SMS</span>
            </div>
            <p className="footer-about-text">
              Providing modern enterprise planning tools to schools, universities, and academic institutions, enhancing communication and database productivity globally.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="social-icon" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" className="social-icon" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#" className="social-icon" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3 className="footer-col-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#hero">Home</a></li>
              <li><a href="#about">About System</a></li>
              <li><a href="#features">Features list</a></li>
              <li><a href="#stats">Courses Overview</a></li>
              <li><a href="#contact">Contact Details</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-col">
            <h3 className="footer-col-title">Contact Information</h3>
            <ul className="footer-contact-info">
              <li>
                <i className="fa-solid fa-envelope"></i>
                <span>info@studentmanagementsystem.com</span>
              </li>
              <li>
                <i className="fa-solid fa-phone"></i>
                <span>+1 (555) 019-2834</span>
              </li>
              <li>
                <i className="fa-solid fa-location-dot"></i>
                <span>100 Education Way, Suite 400, Boston, MA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom text-center">
          <div className="section-container">
            <p className="copyright-text">
              Copyright &copy; 2026 Student Management System. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
