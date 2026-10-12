'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { translations, siteConfig } from '../data/siteConfig';

const techBadges = {
  en: ['🌷 Dreams', '💡 Confidence', '✨ Happiness'],
  fa: ['🌷 آرزوها', '💡 اعتماد به نفس', '✨ شادی'],
};

const syntaxPattern = /(\/\*.*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:const|function|return|false|true|new|class|public|static|void|while|export|default|Infinity|True)\b|\b\d+(?:%|\.\d+)?\b)/g;

function HighlightedCode({ line }) {
  const parts = line.split(syntaxPattern).filter((part) => part !== undefined);

  return parts.map((part, index) => {
    if (!part) return null;
    const className = /^("|'|\/\*)/.test(part)
      ? 'syntax-string'
      : /^(?:false|true|Infinity|True|\d)/.test(part)
        ? 'syntax-value'
        : syntaxPattern.test(part)
          ? 'syntax-keyword'
          : '';
    syntaxPattern.lastIndex = 0;
    return className ? <span className={className} key={`${part}-${index}`}>{part}</span> : part;
  });
}

function ThemeToggle({ lang, onToggle, isRose }) {
  return (
    <button className="theme-button" onClick={onToggle} type="button" aria-label={lang === 'fa' ? 'تغییر تم' : 'Toggle theme'}>
      {lang === 'fa' ? `تم: ${isRose ? 'رز' : 'تاریک'}` : `Theme: ${isRose ? 'Rose' : 'Midnight'}`}
    </button>
  );
}

function LanguageSwitcher({ language, onChange }) {
  return (
    <div className="lang-switch" role="group" aria-label={language === 'fa' ? 'انتخاب زبان' : 'Choose language'}>
      <button
        type="button"
        className={language === 'en' ? 'lang active' : 'lang'}
        onClick={() => onChange('en')}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        className={language === 'fa' ? 'lang active' : 'lang'}
        onClick={() => onChange('fa')}
        aria-pressed={language === 'fa'}
      >
        دری
      </button>
    </div>
  );
}

function TypewriterIntro({ text, followup, lang }) {
  const [current, setCurrent] = useState('');
  const [showFollowup, setShowFollowup] = useState(false);

  useEffect(() => {
    let i = 0;
    setCurrent('');
    setShowFollowup(false);
    const timer = setInterval(() => {
      i += 1;
      setCurrent(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setShowFollowup(true);
      }
    }, 32);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="typewriter-group" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <div className="typewriter">{current}<span className="cursor" /></div>
      {showFollowup && <div className="typewriter-followup">{followup}</div>}
    </div>
  );
}

function BootTerminal({ lang }) {
  const [visible, setVisible] = useState([]);
  const [sequenceKey, setSequenceKey] = useState(0);

  useEffect(() => {
    const items = translations[lang].boot.lines;
    const timers = [];

    setVisible([]);

    items.forEach((line, idx) => {
      const timer = setTimeout(() => {
        setVisible((prev) => (prev.includes(line) ? prev : [...prev, line]));
      }, idx * 420 + 200);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [lang, sequenceKey]);

  return (
    <div className="panel boot-panel">
      <div className="panel-header">
        <h3>{translations[lang].boot.sectionTitle}</h3>
        <button type="button" className="mini-btn" onClick={() => setSequenceKey((prev) => prev + 1)}>
          {translations[lang].boot.replay}
        </button>
      </div>
      <ul className="boot-list">
        {translations[lang].boot.lines.map((line, index) => (
          <li key={`${line}-${index}-${sequenceKey}`} className={visible.includes(line) ? 'show' : ''}>
            <span className="status-dot" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodeEditor({ lang }) {
  const [copied, setCopied] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [visibleOutcome, setVisibleOutcome] = useState(0);
  const editorRef = useRef(null);
  const copyTimer = useRef(null);
  const code = translations[lang].editor.code;
  const outcome = translations[lang].editor.outcome;

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  useEffect(() => {
    if (!runKey) return undefined;
    setVisibleOutcome(0);
    const timers = outcome.map((_, index) => setTimeout(() => setVisibleOutcome(index + 1), 360 * (index + 1)));
    return () => timers.forEach(clearTimeout);
  }, [runKey, outcome]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await editorRef.current?.requestFullscreen();
    }
  };

  return (
    <div className="editor-shell reveal" ref={editorRef}>
      <div className="editor-topbar">
        <div className="window-controls">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="editor-tab">{translations[lang].editor.tab}</div>
        <div className="editor-actions-inline">
          <button type="button" className="mini-btn" onClick={copyCode}>{copied ? '✓' : translations[lang].editor.copy}</button>
          <button type="button" className="mini-btn" onClick={toggleFullscreen}>{translations[lang].editor.full}</button>
        </div>
      </div>

      <div className="code-window ltr-code">
        {code.split('\n').map((line, idx) => (
          <div key={`${line}-${idx}`} className="code-line">
            <span className="line-number">{idx + 1}</span>
            <span className="code-content"><HighlightedCode line={line} /></span>
          </div>
        ))}
      </div>

      <div className="editor-footer">
        <button type="button" className="run-button" onClick={() => setRunKey((key) => key + 1)}>{translations[lang].editor.label}</button>
      </div>
      {runKey > 0 && (
        <div className="editor-result ltr-code" role="status">
          {outcome.slice(0, visibleOutcome).map((line) => <div key={line}>{line}</div>)}
          {visibleOutcome === outcome.length && <div className="run-celebration">✨ {translations[lang].editor.celebration}</div>}
        </div>
      )}
    </div>
  );
}

function DigitalEnvelope({ lang }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="envelope-wrap reveal">
      <div className={`envelope ${open ? 'open' : ''}`}>
        <div className="envelope-top" />
        <div className="envelope-front">
          <div className="envelope-content">
            <h3>{translations[lang].envelope.title}</h3>
            <button type="button" className="envelope-button" onClick={() => setOpen(true)}>
              {translations[lang].envelope.button}
            </button>
          </div>
        </div>
      </div>

      <div className={`reveal-card ${open ? 'visible' : ''}`}>
        <h4>{translations[lang].envelope.cardTitle}</h4>
        <p>{translations[lang].envelope.body}</p>
        <p>{translations[lang].envelope.close}</p>
      </div>
    </div>
  );
}

function DreamCompiler({ lang }) {
  const [dream, setDream] = useState('');
  const [compiledDream, setCompiledDream] = useState('');
  const [compileKey, setCompileKey] = useState(0);
  const [visibleOutput, setVisibleOutput] = useState(0);
  const output = translations[lang].dreamCompiler.output;

  useEffect(() => {
    if (!compileKey) return undefined;
    setVisibleOutput(0);
    const timers = output.map((_, index) => setTimeout(() => setVisibleOutput(index + 1), 300 * (index + 1)));
    return () => timers.forEach(clearTimeout);
  }, [compileKey, output]);

  const handleCompile = () => {
    const cleanedDream = dream.trim() || translations[lang].dreamCompiler.fallbackDream;
    setCompiledDream(cleanedDream);
    setCompileKey((key) => key + 1);
  };

  return (
    <div className="panel compile-panel reveal">
      <h3>{translations[lang].dreamCompiler.title}</h3>
      <div className="compiler-row">
        <input
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          type="text"
          placeholder={translations[lang].dreamCompiler.placeholder}
          aria-label={translations[lang].dreamCompiler.placeholder}
          dir={lang === 'fa' ? 'rtl' : 'ltr'}
        />
        <button type="button" className="compile-button" onClick={handleCompile}>{translations[lang].dreamCompiler.button}</button>
      </div>
      <div className="compiler-output ltr-code" aria-live="polite">
        {(compileKey ? [...output.slice(0, visibleOutput), ...(visibleOutput === output.length ? ['', `${translations[lang].dreamCompiler.outputLabel}: ${compiledDream}`] : [])] : translations[lang].dreamCompiler.initialOutput).map((line, index) => <div key={`${line}-${index}`}>{line || '\u00a0'}</div>)}
      </div>
    </div>
  );
}

function JourneyTimeline({ lang }) {
  const [selectedStep, setSelectedStep] = useState(-1);

  return (
    <div className="journey-grid reveal">
      {translations[lang].journey.steps.map((step, index) => (
        <article
          className={`journey-card ${selectedStep === index ? 'selected' : ''}`}
          key={step.title}
          data-step={String(index + 1).padStart(2, '0')}
          role="button"
          tabIndex={0}
          aria-pressed={selectedStep === index}
          onClick={() => setSelectedStep(selectedStep === index ? -1 : index)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setSelectedStep(selectedStep === index ? -1 : index);
            }
          }}
        >
          <span className="journey-index">{String(index + 1).padStart(2, '0')}</span>
          <h4>{step.title}</h4>
          <p>{step.text}</p>
        </article>
      ))}
    </div>
  );
}

function Error404({ lang }) {
  return (
    <div className="panel error-panel reveal">
      <h3>{translations[lang].error404.title}</h3>
      <p>{translations[lang].error404.subtitle}</p>
      <div className="error-lines">
        <span>{translations[lang].error404.line1}</span>
        <span>{translations[lang].error404.line2}</span>
        <span>{translations[lang].error404.line3}</span>
        <span>{translations[lang].error404.line4}</span>
        <span>{translations[lang].error404.line5}</span>
        <span>{translations[lang].error404.line6}</span>
      </div>
    </div>
  );
}

function SecretDeveloperMode({ lang }) {
  const [opened, setOpened] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 5) setOpened(true);
  };

  return (
    <div className="secret-panel reveal">
      <button type="button" className="secret-trigger" aria-label={translations[lang].secret.triggerLabel} aria-describedby="secret-hint" onClick={handleClick}>
        🧠
      </button>
      {!opened && (
        <span className="secret-hint" id="secret-hint" aria-live="polite">
          {clickCount === 0
            ? translations[lang].secret.hintInitial
            : translations[lang].secret.hint.replace('{count}', String(Math.max(0, 5 - clickCount)))}
        </span>
      )}
      {opened && (
        <div className="secret-box">
          <h4>{translations[lang].secret.title}</h4>
          <p>{translations[lang].secret.subtitle}</p>
          <code className="ltr-code">{translations[lang].secret.console}</code>
        </div>
      )}
    </div>
  );
}

function FinalCelebration({ lang }) {
  const celebrationRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = celebrationRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`final-celebration ${entered ? 'entered' : ''}`} ref={celebrationRef}>
      {siteConfig.enableParticles && (
        <div className="celebration-sky" aria-hidden="true">
          {['✿', '✦', '♡', '✧', '✿', '✦', '♡', '✧', '✿', '✦', '♡', '✧'].map((symbol, index) => <span key={`${symbol}-${index}`}>{symbol}</span>)}
        </div>
      )}
      <div className="final-content">
        <p>{translations[lang].final.title}</p>
        <h3>{translations[lang].final.headline}</h3>
        <div className="final-badge">{translations[lang].final.final}</div>
      </div>
    </section>
  );
}

function FooterBlock({ lang }) {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p className="footer-credit">{translations[lang].footer.text}</p>
        <p className="footer-craft">{translations[lang].footer.quote}</p>
        <pre className="footer-code ltr-code">{translations[lang].footer.code}</pre>
        <p className="footer-closing">{translations[lang].footer.closing}</p>
      </div>
    </footer>
  );
}

export default function Home({ view = 'home' }) {
  const router = useRouter();
  const [lang, setLang] = useState(siteConfig.defaultLanguage);
  const [isRose, setIsRose] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ctaStatus, setCtaStatus] = useState('idle');
  const [buttonBurst, setButtonBurst] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState('help');
  const [selectedTech, setSelectedTech] = useState(-1);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const heroTimers = useRef([]);

  useEffect(() => () => heroTimers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const stored = localStorage.getItem('girls-day-lang');
    const storedTheme = localStorage.getItem('girls-day-theme');
    if (stored === 'fa' || stored === 'en') setLang(stored);
    if (storedTheme === 'rose') setIsRose(true);
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem('girls-day-lang', lang);
    document.documentElement.lang = lang === 'fa' ? 'fa-AF' : 'en';
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang, preferencesLoaded]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem('girls-day-theme', isRose ? 'rose' : 'midnight');
    document.body.classList.toggle('theme-rose', isRose);
  }, [isRose, preferencesLoaded]);

  const ui = useMemo(() => translations[lang], [lang]);

  const runSurprise = () => {
    if (ctaStatus !== 'idle') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCtaStatus('compiling');
    setButtonBurst(true);
    heroTimers.current.push(setTimeout(() => setButtonBurst(false), reducedMotion ? 0 : 700));
    heroTimers.current.push(setTimeout(() => setCtaStatus('success'), reducedMotion ? 0 : 700));
    heroTimers.current.push(setTimeout(() => router.push('/surprise#surprise'), reducedMotion ? 150 : 1450));
  };

  return (
    <div className={`page-shell ${lang === 'fa' ? 'rtl' : 'ltr'}`} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <header className="site-header">
        <div className="container nav-wrap">
          <div className="brand-block">
            <span>GirlsDay</span>
            <span className="brand-dot" aria-hidden="true" />
          </div>

          <nav id="main-navigation" className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`} aria-label={lang === 'fa' ? 'پیمایش اصلی' : 'Main navigation'}>
            <Link href="/" aria-current={view === 'home' ? 'page' : undefined} onClick={() => setMobileMenuOpen(false)}>{ui.nav.home}</Link>
            <Link href="/story" aria-current={view === 'story' ? 'page' : undefined} onClick={() => setMobileMenuOpen(false)}>{ui.nav.story}</Link>
            <Link href="/dreams" aria-current={view === 'dreams' ? 'page' : undefined} onClick={() => setMobileMenuOpen(false)}>{ui.nav.dream}</Link>
            <Link href="/surprise" aria-current={view === 'surprise' ? 'page' : undefined} onClick={() => setMobileMenuOpen(false)}>{ui.nav.surprise}</Link>
          </nav>

          <div className="nav-tools">
            <ThemeToggle lang={lang} isRose={isRose} onToggle={() => setIsRose((p) => !p)} />
            <LanguageSwitcher language={lang} onChange={setLang} />
            <button
              type="button"
              className="mobile-menu-button"
              aria-label={mobileMenuOpen ? ui.hero.closeMenu : ui.hero.menu}
              aria-expanded={mobileMenuOpen}
              aria-controls="main-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main>
        {view === 'home' && <section className="hero-section" id="hero">
          {siteConfig.enableParticles && (
            <div className="hero-atmosphere" aria-hidden="true">
              {['{ }', '</>', 'const', '01', '✨'].map((symbol, index) => <span key={symbol} className={`hero-symbol hero-symbol-${index + 1}`}>{symbol}</span>)}
            </div>
          )}
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="hero-badge hero-entrance" style={{ '--entry-delay': '0ms' }}>{ui.hero.eyebrow}</span>
              <h1 className="hero-code-title ltr-code hero-entrance" dir="ltr" style={{ '--entry-delay': '90ms' }}>{ui.hero.codeTitle}</h1>
              <h2 className="hero-greeting hero-entrance" style={{ '--entry-delay': '180ms' }}>{ui.hero.title}</h2>
              <div className="hero-subtitle hero-entrance" style={{ '--entry-delay': '270ms' }}>
                {ui.hero.subtitle.map((line) => <p key={line}>{line}</p>)}
              </div>
              <div className="cta-row hero-entrance" style={{ '--entry-delay': '360ms' }}>
                <button
                  type="button"
                  className={`primary-button ${buttonBurst ? 'button-burst' : ''}`}
                  id="run-surprise"
                  onClick={runSurprise}
                  disabled={ctaStatus !== 'idle'}
                  aria-live="polite"
                >
                  {ctaStatus === 'compiling' ? ui.hero.compiling : ctaStatus === 'success' ? ui.hero.success : ui.hero.mainButton}
                  {buttonBurst && <span className="cta-particles" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i><i>✧</i></span>}
                </button>
                <Link className="secondary-button" href="/story">{ui.hero.secondaryButton}</Link>
              </div>
              <div className="meta-row hero-entrance" style={{ '--entry-delay': '450ms' }}>
                {techBadges[lang].map((item) => <span key={item} className="meta-pill">{item}</span>)}
              </div>
              <p className="hero-status hero-entrance" style={{ '--entry-delay': '540ms' }}><span aria-hidden="true">●</span> {ui.hero.status}</p>
              <div className="hero-typewriter hero-entrance" style={{ '--entry-delay': '600ms' }}>
                <TypewriterIntro text={ui.hero.intro1} followup={ui.hero.intro2} lang={lang} />
              </div>
            </div>
            <Link className="scroll-indicator hero-entrance" href="/story" style={{ '--entry-delay': '680ms' }}>
              <span>{ui.hero.scroll}</span>
              <span className="scroll-arrow" aria-hidden="true">↓</span>
            </Link>
          </div>
        </section>}

        {view === 'surprise' && <section className="section" id="surprise">
          <div className="container">
            <BootTerminal lang={lang} />
          </div>
        </section>}

        {view === 'story' && <section className="section" id="story">
          <div className="container">
            <div className="section-heading reveal">
              <h2>{translations[lang].editor.title}</h2>
            </div>
            <CodeEditor lang={lang} />
          </div>
        </section>}

        {view === 'story' && <section className="section">
          <div className="container">
            <div className="message-box reveal">
              <h3>{translations[lang].mainGreeting.headline}</h3>
              {translations[lang].mainGreeting.paragraphs.map((paragraph, index) => (
                paragraph
                  ? <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  : <div className="message-spacer" key={`spacer-${index}`} aria-hidden="true" />
              ))}
            </div>
          </div>
        </section>}

        {view === 'story' && <section className="section">
          <div className="container">
            {siteConfig.enableTerminal && <>
            <div className="section-heading reveal">
              <h2>{translations[lang].terminal.title}</h2>
            </div>

            <div className="terminal-grid reveal">
              <div className="terminal-box">
                <div className="terminal-output ltr-code">
                  <div><span className="prompt">girl@future:~$</span> {terminalCommand}</div>
                  {terminalCommand !== 'clear' && <div>{translations[lang].terminal[terminalCommand] || translations[lang].terminal.help}</div>}
                </div>
                <div className="command-row">
                  {translations[lang].terminal.commands.map((cmd) => (
                    <button type="button" key={cmd} className="command-btn" onClick={() => setTerminalCommand(cmd)} aria-pressed={terminalCommand === cmd}>{cmd}</button>
                  ))}
                </div>
              </div>

              <div className="terminal-box">
                <div className="terminal-output ltr-code">
                  <div><span className="prompt">girl@future:~$</span> status</div>
                  <div>{translations[lang].terminal.status}</div>
                  <div><span className="prompt">girl@future:~$</span> code</div>
                  <div>{translations[lang].terminal.developerNote}</div>
                </div>
              </div>
            </div>
            </>}
          </div>
        </section>}

        {view === 'dreams' && <section className="section" id="dream">
          <div className="container">
            <div className="section-heading reveal">
              <h2>{translations[lang].techTitle}</h2>
            </div>
            <div className="tech-grid reveal">
              {translations[lang].techCards.map((card, index) => (
                <article
                  className={`tech-card ${selectedTech === index ? 'selected' : ''}`}
                  key={card.title}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedTech === index}
                  onClick={() => setSelectedTech(selectedTech === index ? -1 : index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedTech(selectedTech === index ? -1 : index);
                    }
                  }}
                >
                  <h4>{card.title}</h4>
                  <pre className="ltr-code">{card.code}</pre>
                </article>
              ))}
            </div>
          </div>
        </section>}

        {view === 'surprise' && <section className="section">
          <div className="container">
            <DigitalEnvelope lang={lang} />
          </div>
        </section>}

        {view === 'story' && <section className="section">
          <div className="container">
            <div className="section-heading reveal">
              <h2>{translations[lang].journey.title}</h2>
            </div>
            <JourneyTimeline lang={lang} />
          </div>
        </section>}

        {view === 'dreams' && <section className="section">
          <div className="container">
            <DreamCompiler lang={lang} />
          </div>
        </section>}

        {view === 'surprise' && <section className="section">
          <div className="container">
            <Error404 lang={lang} />
            {siteConfig.enableEasterEggs && <SecretDeveloperMode lang={lang} />}
          </div>
        </section>}

        {view === 'surprise' && <FinalCelebration lang={lang} />}
      </main>

      <FooterBlock lang={lang} />
    </div>
  );
}
