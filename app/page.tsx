'use client';

import React from 'react';

import Hyperspeed from "@/components/Hyperspeed";
import { hyperspeedPresets } from "@/components/HyperSpeedPresets";
import StaggeredMenu from "@/components/StaggeredMenu";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/Footer";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import LoadingScreen from "@/components/LoadingScreen";
import TerminalSkills from "@/components/TerminalSkills";
import ScrambledText from "@/components/ScrambledText";
import CurvedLoop from "@/components/CurvedLoop";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowDown, ArrowUp, ArrowRight,
  Code2, Cpu, Globe, Layers, Zap,
  Server, Database, Monitor, Shield,
  ExternalLink, Github, Twitter, Linkedin, Mail, Send,
} from "lucide-react";

/* ─── Navigation ─────────────────────────────────────── */
const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home', link: '#home' },
  { label: 'About', ariaLabel: 'Learn about me', link: '#about' },
  { label: 'Skills', ariaLabel: 'View my skills', link: '#skills' },
  { label: 'Projects', ariaLabel: 'View my projects', link: '#projects' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' },
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com/whoviishal' },
  { label: 'GitHub', link: 'https://github.com/vishalmaurya21' },
  { label: 'LinkedIn', link: 'https://linkedin.com/in/vishalmaurya21' },
];

/* ─── Projects (with API endpoint badges) ────────────── */
const projects = [
  {
    title: "AI-Chatbot",
    description: "A RESTful AI chatbot backend with real-time response streaming, session management, and OpenAI API integration. Features WebSocket support and Redis-based rate limiting.",
    tech: ["Node.js", "Express.js", "OpenAI API", "Redis", "WebSocket"],
    link: "https://github.com/vishalmaurya21/AI-Chatbot",
    method: "POST",
    endpoint: "/api/v1/chat/complete",
  },
  {
    title: "QR Code Generator",
    description: "A high-performance REST API service for on-demand QR code generation. Supports custom sizes, PNG/SVG formats, and batch generation with Docker-based deployment.",
    tech: ["Node.js", "REST API", "Docker", "Redis"],
    link: "https://github.com/vishalmaurya21/qr-code-generator",
    method: "GET",
    endpoint: "/api/v1/qr/generate",
  },
  {
    title: "CRUD API",
    description: "A production-ready CRUD API with JWT authentication, input validation, database migrations, and comprehensive error handling — following RESTful conventions and MVC architecture.",
    tech: ["PHP", "MySQL", "Laravel", "REST API", "JWT"],
    link: "https://github.com/vishalmaurya21/crud_opration",
    method: "DELETE",
    endpoint: "/api/v1/resource/:id",
  },
  {
    title: "Snake Game",
    description: "A real-time multiplayer game backend with stateful session management, WebSocket connections for live gameplay, and leaderboard persistence in Redis.",
    tech: ["Python", "WebSocket", "Redis", "Pygame"],
    link: "https://github.com/vishalmaurya21/snake-game",
    method: "GET",
    endpoint: "/api/v1/game/state",
  },
];

/* ─── Architecture strip nodes ───────────────────────── */
const archNodes = [
  { label: 'Client', icon: <Monitor className="w-5 h-5" />, color: '#94a3b8', border: 'rgba(148,163,184,0.3)', bg: 'rgba(148,163,184,0.08)' },
  { label: 'API Gateway', icon: <Globe className="w-5 h-5" />, color: '#3b82f6', border: 'rgba( 59,130,246,0.3)', bg: 'rgba( 59,130,246,0.08)' },
  { label: 'App Server', icon: <Server className="w-5 h-5" />, color: '#e31616', border: 'rgba(227, 22, 22,0.3)', bg: 'rgba(227, 22, 22,0.08)' },
  { label: 'PostgreSQL', icon: <Database className="w-5 h-5" />, color: '#10b981', border: 'rgba( 16,185,129,0.3)', bg: 'rgba( 16,185,129,0.08)' },
  { label: 'Redis Cache', icon: <Zap className="w-5 h-5" />, color: '#f59e0b', border: 'rgba(245,158, 11,0.3)', bg: 'rgba(245,158, 11,0.08)' },
  { label: 'Auth / JWT', icon: <Shield className="w-5 h-5" />, color: '#8b5cf6', border: 'rgba(139, 92,246,0.3)', bg: 'rgba(139, 92,246,0.08)' },
];

/* ─── Intersection observer hook ─────────────────────── */
function useSectionReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('section-hidden');
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('section-visible');
          obs.unobserve(el);
        }
      },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Contact form ───────────────────────────────────── */

/* ─────────────────────────────────────────────────────── */
export default function Home() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    setFormError('');
    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setFormState('success');
        form.reset();
      } else {
        setFormState('error');
        setFormError(json.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormState('error');
      setFormError('Network error. Please check your connection and try again.');
    }
  };

  const aboutRef = useSectionReveal() as React.RefObject<HTMLElement>;
  const skillsRef = useSectionReveal() as React.RefObject<HTMLElement>;
  const projectsRef = useSectionReveal() as React.RefObject<HTMLElement>;
  const contactRef = useSectionReveal() as React.RefObject<HTMLElement>;

  useEffect(() => {
    setMounted(true);
    const onResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

  const currentTheme = resolvedTheme || theme;

  const hyperspeedOptions = currentTheme === 'dark'
    ? hyperspeedPresets.two
    : {
      ...hyperspeedPresets.two,
      colors: {
        ...hyperspeedPresets.two.colors,
        background: 0xffffff, roadColor: 0xf0f0f0,
        islandColor: 0xf5f5f5, shoulderLines: 0xcccccc, brokenLines: 0xcccccc,
      },
    };

  if (!mounted) return null;

  return (
    <div className="portfolio-shell relative min-h-screen font-sans bg-background text-foreground transition-colors duration-300">

      <LoadingScreen />
      <a href="#home" className="skip-to-content">Skip to content</a>

      {/* Hyperspeed background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div id="lights" style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Hyperspeed effectOptions={hyperspeedOptions} />
        </div>
      </div>

      {/* Navigation */}
      <StaggeredMenu
        /* @ts-ignore */
        items={menuItems}
        /* @ts-ignore */
        socialItems={socialItems}
        accentColor="#e31616"
        colors={currentTheme === 'dark' ? ['#1e1e22', '#35353c'] : ['#f0f0f0', '#e0e0e0']}
        isFixed={true}
        menuButtonColor={currentTheme === 'dark' ? '#f4f4f5' : '#18181b'}
        openMenuButtonColor={currentTheme === 'dark' ? '#f4f4f5' : '#18181b'}
        changeMenuColorOnOpen={false}
        logoUrl=""
        extraHeaderContent={<ThemeToggle />}
      />

      {/* Scroll to top */}
      <button
        className={`scroll-to-top${showScrollTop ? '' : ' hidden'}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* ── PAGE CONTENT ───────────────────────────────── */}
      <div className="relative z-10 flex flex-col font-sans">

        {/* ── HERO ─────────────────────────────────────── */}
        <section id="home" className="hero-section relative min-h-screen flex items-center px-5 sm:px-8 md:px-16 lg:px-24 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16">

              {/* ── Left: text ── */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-5 lg:pr-4">

                {/* Availability chip */}
                <div className="hero-item hero-item-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e31616] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e31616]" />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Available for projects
                  </span>
                </div>

                {/* Headline */}
                <h1 className="hero-item hero-item-2 text-[clamp(2.6rem,9vw,7rem)] font-black tracking-tighter text-foreground leading-[0.88] select-none uppercase">
                  API<br />
                  <span className="text-transparent stroke-text">ARTISAN.</span>
                </h1>

                {/* Tagline — short and punchy */}
                {/* @ts-ignore */}
                <ScrambledText
                  className="hero-item hero-item-3 text-[clamp(0.9rem,1.6vw,1.1rem)] text-muted-foreground leading-relaxed max-w-sm"
                  radius={100} duration={1} speed={0.4} scrambleChars=".:"
                >
                  Crafting scalable APIs, robust systems & backend architectures that power real products.
                </ScrambledText>

                {/* CTAs */}
                <div className="hero-item hero-item-4 flex flex-wrap justify-center lg:justify-start gap-3">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#e31616] text-white font-bold tracking-widest uppercase text-xs rounded-xl hover:bg-[#c41010] transition-all duration-300 hover:-translate-y-1"
                  >
                    View Projects
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 text-foreground font-bold tracking-widest uppercase text-xs rounded-xl hover:bg-foreground/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
                  >
                    Let’s Talk
                  </a>
                </div>
              </div>


              {/* ── Right: floating JSON API card ── */}

              <div className="hidden lg:flex justify-center items-center hero-item hero-item-5">
                <div className="hero-api-card">
                  {/* Title bar */}
                  <div className="hero-card-titlebar">
                    <div className="ts-lights" aria-hidden="true">
                      <span className="ts-light ts-close" />
                      <span className="ts-light ts-minimize" />
                      <span className="ts-light ts-maximize" />
                    </div>
                    <span className="hero-card-url">GET /api/developer  HTTP/1.1</span>
                    <span className="hero-card-ok">200 OK</span>
                  </div>
                  {/* JSON body */}
                  <div className="hero-card-body">
                    <p><span className="hc-comment">// Response from vishalmaurya.dev</span></p>
                    <p>&nbsp;</p>
                    <p><span className="hc-brace">{'{'}</span></p>
                    <p>&nbsp;&nbsp;<span className="hc-key">"name"</span><span className="hc-brace">: </span><span className="hc-str">"Vishal Maurya"</span><span className="hc-brace">,</span></p>
                    <p>&nbsp;&nbsp;<span className="hc-key">"role"</span><span className="hc-brace">: </span><span className="hc-str">"Backend Engineer"</span><span className="hc-brace">,</span></p>
                    <p>&nbsp;&nbsp;<span className="hc-key">"languages"</span><span className="hc-brace">: </span><span className="hc-arr">[</span><span className="hc-str">"Java"</span><span className="hc-brace">, </span><span className="hc-str">"Python"</span><span className="hc-brace">, </span><span className="hc-str">"PHP"</span><span className="hc-arr">]</span><span className="hc-brace">,</span></p>
                    <p>&nbsp;&nbsp;<span className="hc-key">"frameworks"</span><span className="hc-brace">: </span><span className="hc-arr">[</span><span className="hc-str">"Spring Boot"</span><span className="hc-brace">, </span><span className="hc-str">"Laravel"</span><span className="hc-arr">]</span><span className="hc-brace">,</span></p>
                    <p>&nbsp;&nbsp;<span className="hc-key">"databases"</span><span className="hc-brace">: </span><span className="hc-arr">[</span><span className="hc-str">"MySQL"</span><span className="hc-brace">, </span><span className="hc-str">"MongoDB"</span><span className="hc-arr">]</span><span className="hc-brace">,</span></p>
                    <p>&nbsp;&nbsp;<span className="hc-key">"devops"</span><span className="hc-brace">: </span><span className="hc-arr">[</span><span className="hc-str">"Git"</span><span className="hc-brace">, </span><span className="hc-str">"Docker"</span><span className="hc-arr">]</span><span className="hc-brace">,</span></p>
                    <p>&nbsp;&nbsp;<span className="hc-key">"available"</span><span className="hc-brace">: </span><span className="hc-bool">true</span><span className="hc-brace">,</span></p>
                    <p>&nbsp;&nbsp;<span className="hc-key">"uptime"</span><span className="hc-brace">: </span><span className="hc-num">"99.9%"</span></p>
                    <p><span className="hc-brace">{'}'}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-30">
            <ArrowDown className="w-4 h-4" />
          </div>
        </section>


        {/* ── ABOUT ─────────────────────────────────────── */}
        <section
          id="about"
          ref={aboutRef as React.Ref<HTMLElement>}
          className="py-10 sm:py-14 px-6 sm:px-8 md:px-24 bg-background/40 backdrop-blur-xl border-y border-border/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

              <div className="lg:col-span-12 mb-4">
                <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-[#e31616] mb-3">01 / About Me</h2>
                <div className="h-px w-24 bg-[#e31616]" />
              </div>

              {/* Left col — bio */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-5 text-[clamp(1.3rem,3.5vw,2.5rem)] font-medium text-foreground leading-[1.1] tracking-tight">
                  {/* @ts-ignore */}
                  <ScrambledText
                    radius={120}
                    duration={1.2}
                    speed={0.5}
                    scrambleChars=".:"
                    style={{
                      fontSize: 'clamp(1.3rem,3.5vw,2.5rem)',
                      fontWeight: 500,
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      color: 'var(--foreground)',
                    }}
                  >
                    I am Vishal Maurya, a Backend Engineer who architects scalable, reliable server-side systems.
                  </ScrambledText>
                  {/* @ts-ignore */}
                  <ScrambledText
                    radius={120}
                    duration={1.2}
                    speed={0.5}
                    scrambleChars=".:"
                    style={{
                      fontSize: 'clamp(1.3rem,3.5vw,2.5rem)',
                      fontWeight: 500,
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      color: 'var(--muted-foreground)',
                      opacity: 0.8,
                    }}
                  >
                    From designing REST APIs to managing databases at scale — I build the invisible infrastructure that powers great digital products.
                  </ScrambledText>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border/50">
                  {[
                    {
                      icon: <Server className="w-5 h-5" />,
                      title: 'Scalable Architecture',
                      desc: 'Designing distributed systems that handle millions of requests with horizontal scaling and fault tolerance.',
                    },
                    {
                      icon: <Code2 className="w-5 h-5" />,
                      title: 'API Design',
                      desc: 'Building clean, versioned REST & GraphQL APIs following industry standards, with proper auth and rate limiting.',
                    },
                    {
                      icon: <Database className="w-5 h-5" />,
                      title: 'Database Mastery',
                      desc: 'Optimizing complex queries, designing normalized schemas, and managing data pipelines efficiently.',
                    },
                    {
                      icon: <Shield className="w-5 h-5" />,
                      title: 'Security First',
                      desc: 'Implementing JWT auth, input validation, SQL injection prevention, and secure API gateways.',
                    },
                  ].map((t, i) => (
                    <div key={t.title} className={`space-y-3 about-card about-card-${i + 1}`}>
                      <div className="flex items-center gap-3 text-[#e31616]">
                        {t.icon}
                        <h3 className="font-bold uppercase tracking-wider text-sm">{t.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-sm">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col — tech stack */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 backdrop-blur-md">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-[#e31616]" />
                    Core Stack
                  </h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    {[
                      { icon: <Globe className="w-4 h-4" />, name: 'Java' },
                      { icon: <Code2 className="w-4 h-4" />, name: 'Spring Boot' },
                      { icon: <Zap className="w-4 h-4" />, name: 'Python' },
                      { icon: <Layers className="w-4 h-4" />, name: 'Laravel' },
                      { icon: <Database className="w-4 h-4" />, name: 'MySQL' },
                      { icon: <Server className="w-4 h-4" />, name: 'Docker' },
                    ].map(s => (
                      <div key={s.name} className="flex items-center gap-3 group">
                        <div className="p-2 rounded-lg bg-background border border-border group-hover:border-[#e31616] transition-colors">
                          {s.icon}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {s.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uptime / fun stats block */}
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 backdrop-blur-md font-mono text-xs space-y-2.5">
                  <p className="text-[#e31616] font-bold uppercase tracking-widest text-[10px] mb-3">System Status</p>
                  {[
                    { key: 'languages', val: 'Java · Python · PHP' },
                    { key: 'frameworks', val: 'Spring Boot · Laravel' },
                    { key: 'databases', val: 'MySQL · MongoDB' },
                    { key: 'devops', val: 'Git · Docker · linux' },
                    { key: 'status', val: 'available' },
                  ].map(r => (
                    <div key={r.key} className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">{r.key}</span>
                      <span className="text-foreground font-bold">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SKILLS ────────────────────────────────────── */}
        <section
          id="skills"
          ref={skillsRef as React.Ref<HTMLElement>}
          className="py-10 sm:py-14 px-6 sm:px-8 md:px-24 bg-background/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="lg:col-span-12 mb-10">
              <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-[#e31616] mb-4">02 / Skills</h2>
              <h3 className="text-[clamp(2.5rem,7vw,5rem)] font-black text-foreground tracking-tighter">TECH STACK</h3>
              {/* @ts-ignore */}
              <ScrambledText
                className="mt-3 max-w-lg text-muted-foreground text-[clamp(0.9rem,1.4vw,1rem)] leading-relaxed"
                radius={100} duration={1} speed={0.4} scrambleChars=".:"
              >
                Backend technologies I work with daily — from language to deployment.
              </ScrambledText>
            </div>

            {/* Terminal + bars */}
            <TerminalSkills />

            {/* Architecture strip */}
            <div className="arch-section mt-10 border-t border-border/30 pt-8">
              <div className="mb-10 w-full overflow-hidden" style={{ minHeight: '120px' }}>
                <CurvedLoop
                  marqueeText="// System Architecture — how I think about backend systems ✦ "
                  speed={2}
                  curveAmount={250}
                  className="fill-[#e31616]"
                />
              </div>
              <div className="arch-flow">
                {archNodes.map((node, i) => (
                  <React.Fragment key={node.label}>
                    <div className={`arch-node arch-node-anim arch-node-anim-${i + 1}`} title={node.label}>
                      <div
                        className="arch-node-icon"
                        style={{ background: node.bg, borderColor: node.border, color: node.color }}
                      >
                        {node.icon}
                      </div>
                      <span className="arch-node-label">{node.label}</span>
                    </div>
                    {i < archNodes.length - 1 && (
                      <div className="arch-arrow">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ���─────────────────────────────────── */}
        <section
          id="projects"
          ref={projectsRef as React.Ref<HTMLElement>}
          className="projects-section py-16 sm:py-20 px-5 sm:px-8 md:px-16 lg:px-24 bg-background/55 backdrop-blur-xl border-t border-border/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-[#e31616]">03 / Featured Work</h2>
                <h3 className="text-[clamp(3rem,8vw,5.5rem)] font-black text-foreground tracking-tighter">PROJECTS</h3>
              </div>
              {/* @ts-ignore */}
              <ScrambledText
                className="max-w-md text-muted-foreground text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed"
                radius={100} duration={1} speed={0.4} scrambleChars=".:"
              >
                Backend systems and APIs built to be fast, secure, and production-ready.
              </ScrambledText>
            </div>

            <ScrollStack
              useWindowScroll={true}
              itemDistance={isMobile ? 220 : isTablet ? 150 : 100}
              stackPosition={isMobile ? "10%" : isTablet ? "15%" : "20%"}
              itemStackDistance={isMobile ? 8 : isTablet ? 12 : 15}
              itemScale={isMobile ? 0.005 : isTablet ? 0.02 : 0.03}
              baseScale={isMobile ? 0.98 : isTablet ? 0.95 : 0.9}
              blurAmount={isMobile ? 0.5 : isTablet ? 1 : 1.5}
            >
              {projects.map((project, index) => (
                <ScrollStackItem key={index}>
                  <div className="group h-full flex flex-col justify-between p-6 sm:p-8">
                    <div className="flex-1">

                      {/* Header row */}
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[10px] font-mono text-[#e31616] tracking-[0.3em] font-bold uppercase">
                          0{index + 1} / Backend
                        </span>
                        <div className="flex gap-5">
                          <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`}>
                            <Github className="w-4 h-4 text-muted-foreground hover:text-foreground transition-all hover:scale-110" />
                          </a>
                          <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`}>
                            <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground transition-all hover:scale-110" />
                          </a>
                        </div>
                      </div>

                      {/* API endpoint badge */}
                      <div className="api-badge">
                        <span className={`api-method api-method--${project.method}`}>{project.method}</span>
                        <span className="api-endpoint-path">{project.endpoint}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tighter group-hover:text-[#e31616] transition-colors duration-500">
                        {project.title}
                      </h3>

                      <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed font-light">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-10">
                        {project.tech.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-foreground/5 rounded-full text-[9px] font-mono tracking-wider uppercase text-muted-foreground border border-border/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn w-full sm:w-auto inline-flex items-center justify-center gap-4 px-6 py-4 bg-foreground text-background font-bold tracking-widest uppercase text-xs rounded-xl hover:bg-[#e31616] hover:text-white transition-all duration-300"
                        aria-label={`View ${project.title} source code`}
                      >
                        <span className="font-sans">VIEW SOURCE</span>
                        <ArrowDown className="w-4 h-4 -rotate-[135deg] group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────── */}
        <section
          id="contact"
          ref={contactRef as React.Ref<HTMLElement>}
          className="py-10 sm:py-14 px-4 sm:px-8 md:px-24 bg-background border-t border-border/30"
        >

          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-[#e31616] mb-3">04 / Contact</h2>
              <h3 className="text-[clamp(2rem,6vw,4rem)] font-black text-foreground tracking-tighter leading-tight">
                LET'S CONNECT
              </h3>
              {/* @ts-ignore */}
              <ScrambledText
                className="text-base text-muted-foreground max-w-sm mt-3"
                radius={100} duration={1} speed={0.4} scrambleChars=".:"
              >
                Open to backend roles and freelance projects — drop me a message.
              </ScrambledText>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

              {/* Form */}
              <div className="bg-secondary/20 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-border/50 backdrop-blur-md">
                <h4 className="text-base font-bold mb-6 font-mono uppercase tracking-widest text-[#e31616]">
                  Send a Message
                </h4>

                {/* Success state */}
                {formState === 'success' ? (
                  <div className="contact-success">
                    <div className="contact-success-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#27c93f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="contact-success-title">Message sent!</p>
                    <p className="contact-success-sub">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="contact-success-reset"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
                    <div className="contact-form-group">
                      <label htmlFor="name" className="contact-form-label">Your Name</label>
                      <input id="name" name="name" type="text" className="contact-form-input" placeholder="Vishal Maurya" required autoComplete="name" disabled={formState === 'loading'} />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="email" className="contact-form-label">Email Address</label>
                      <input id="email" name="email" type="email" className="contact-form-input" placeholder="you@example.com" required autoComplete="email" disabled={formState === 'loading'} />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="message" className="contact-form-label">Message</label>
                      <textarea id="message" name="message" className="contact-form-textarea" placeholder="Tell me about your project — stack, scale, problem..." required disabled={formState === 'loading'} />
                    </div>

                    {formState === 'error' && (
                      <p className="contact-form-error">{formError}</p>
                    )}

                    <button
                      type="submit"
                      className={`contact-form-submit flex items-center justify-center gap-3${formState === 'loading' ? ' contact-form-submit--loading' : ''}`}
                      disabled={formState === 'loading'}
                    >
                      {formState === 'loading' ? (
                        <>
                          <span className="contact-spinner" aria-hidden="true" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Social / Email */}
              <div className="space-y-6">
                <a
                  href="mailto:iamviishalkumar@gmail.com"
                  aria-label="Send email to iamviishalkumar@gmail.com"
                  className="group flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xl sm:text-2xl md:text-3xl font-medium text-foreground hover:text-[#e31616] transition-all duration-300"
                >
                  <div className="p-4 rounded-full bg-secondary border border-border group-hover:border-[#e31616] transition-colors">
                    <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  iamviishalkumar@gmail.com
                </a>

                <div className="bg-secondary/20 p-5 rounded-2xl border border-border/50 backdrop-blur-md">
                  <h4 className="text-sm font-bold mb-5 font-mono uppercase tracking-widest text-foreground">Connect</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: 'GitHub', link: 'https://github.com/vishalmaurya21', icon: <Github className="w-5 h-5" />, handle: '@vishalmaurya21' },
                      { label: 'Twitter', link: 'https://twitter.com/whoviishal', icon: <Twitter className="w-5 h-5" />, handle: '@whoviishal' },
                      { label: 'LinkedIn', link: 'https://linkedin.com/in/vishalmaurya21', icon: <Linkedin className="w-5 h-5" />, handle: 'Vishal Maurya' },
                    ].map(s => (
                      <a
                        key={s.label}
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${s.label} profile`}
                        className="group flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-background/50 border border-border/50 hover:border-[#e31616]/50 hover:bg-background transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-secondary group-hover:bg-[#e31616]/10 transition-colors">
                            {s.icon}
                          </div>
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-[#e31616]">{s.label}</p>
                            <p className="font-bold text-sm sm:text-base text-foreground">{s.handle}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-[#e31616] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
