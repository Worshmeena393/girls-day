'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { translations, siteConfig } from '../data/siteConfig';

const codeExamples = [
  { title: 'HTML5', code: '<section class="girl">\n    <dreams>Unlimited</dreams>\n    <future>Beautiful</future>\n</section>' },
  { title: 'CSS', code: '.girl {\n    confidence: 100%;\n    dreams: infinite;\n    happiness: unlimited;\n}' },
  { title: 'JavaScript', code: 'const future = () => {\n    return "Beautiful ✨";\n};' },
  { title: 'React', code: 'function Dreams() {\n    return (\n        <Future unlimited={true} />\n    );\n}' },
  { title: 'Next.js', code: 'export default function Future() {\n    return <Dreams status="possible" />;\n}' },
  { title: 'Python', code: 'while True:\n    dream_big()\n    keep_learning()\n    keep_smiling()\n    never_give_up()' },
  { title: 'Java', code: 'public class Future {\n\n    public static void main(String[] args) {\n\n        System.out.println(\n            "Keep building your dreams!"\n        );\n\n    }\n}' },
];

const techBadges = {
  en: ['✨ Joy', '💡 Confidence', '🌷 Dreams'],
  fa: ['✨ شادی', '💡 اعتماد به نفس', '🌷 آرزوها'],
};

const bootSequence = [
  'Initializing GirlsDay.exe...',
  'Loading happiness............. 100%',
  'Loading dreams................ 100%',
  'Installing confidence......... DONE',
  'Removing sadness.............. DONE',
  'Generating smiles............. DONE',
  'Preparing beautiful future... DONE',
  'BUILD SUCCESSFUL ✓',
  'Launching surprise...',
];

function ThemeToggle({ lang, onToggle, isRose }) {
  return (
    <button className="theme-button" onClick={onToggle} type="button" aria-label={lang === 'fa' ? 'تغییر تم' : 'Toggle theme'}>
      {lang === 'fa' ? `تم: ${isRose ? 'رز' : 'تاریک'}` : `Theme: ${isRose ? 'Rose' : 'Midnight'}`}
    </button>
  );
}

function LanguageSwitcher({ language, onChange }) {
  return (
    <div className="lang-switch" role="tablist" aria-label="Language switcher">
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

function TypewriterIntro({ text, lang }) {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setCurrent(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, 32);
    return () => clearInterval(timer);
  }, [text]);

  return <div className="typewriter" dir={lang === 'fa' ? 'rtl' : 'ltr'}>{current}<span className="cursor" /></div>;
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
  const [hasRun, setHasRun] = useState(false);
  const editorRef = useRef(null);
  const code = translations[lang].editor.code;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
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
            <span className="code-content">{line}</span>
          </div>
        ))}
      </div>

      <div className="editor-footer">
        <button type="button" className="run-button" onClick={() => setHasRun(true)}>{translations[lang].editor.label}</button>
      </div>
      {hasRun && (
        <div className="editor-result ltr-code" role="status">
          {translations[lang].editor.outcome.map((line) => <div key={line}>{line}</div>)}
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
  const [result, setResult] = useState('');

  const handleCompile = () => {
    const cleanedDream = dream.trim() || translations[lang].dreamCompiler.fallbackDream;
    setResult(cleanedDream);
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
        {(result ? [...translations[lang].dreamCompiler.output, '', `${translations[lang].dreamCompiler.outputLabel}: ${result}`] : translations[lang].dreamCompiler.initialOutput).map((line, index) => <div key={`${line}-${index}`}>{line || '\u00a0'}</div>)}
      </div>
    </div>
  );
}

function JourneyTimeline({ lang }) {
  return (
    <div className="journey-grid reveal">
      {translations[lang].journey.steps.map((step, index) => (
        <article className="journey-card" key={step.title} data-step={String(index + 1).padStart(2, '0')}>
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
  return (
    <div className="secret-panel reveal">
      <button type="button" className="secret-trigger" aria-label={lang === 'fa' ? 'تغییر حالت مخفی' : 'Secret developer trigger'} onClick={() => setOpened(true)}>
        🧠
      </button>
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
  return (
    <section className="final-celebration reveal">
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
      <div className="container footer-row">
        <div>{translations[lang].footer.text}</div>
        <div className="footer-quote">{translations[lang].footer.quote}</div>
      </div>
      <pre className="footer-code ltr-code">{translations[lang].footer.code}</pre>
    </footer>
  );
}

export default function Home({ view = 'home' }) {
  const [lang, setLang] = useState(siteConfig.defaultLanguage);
  const [isRose, setIsRose] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState('help');
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

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
    document.documentElement.lang = lang === 'fa' ? 'prs-AF' : 'en';
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang, preferencesLoaded]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem('girls-day-theme', isRose ? 'rose' : 'midnight');
    document.body.classList.toggle('theme-rose', isRose);
  }, [isRose, preferencesLoaded]);

  const ui = useMemo(() => translations[lang], [lang]);

  return (
    <div className={`page-shell ${lang === 'fa' ? 'rtl' : 'ltr'}`} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <header className="site-header">
        <div className="container nav-wrap">
          <div className="brand-block">
            <span className="brand-dot" />
            <span>GirlsDay</span>
          </div>

          <nav className="nav" aria-label="Main navigation">
            <Link href="/">{ui.nav.home}</Link>
            <Link href="/story">{ui.nav.story}</Link>
            <Link href="/dreams">{ui.nav.dream}</Link>
            <Link href="/surprise">{ui.nav.surprise}</Link>
          </nav>

          <div className="nav-tools">
            <ThemeToggle lang={lang} isRose={isRose} onToggle={() => setIsRose((p) => !p)} />
            <LanguageSwitcher language={lang} onChange={setLang} />
          </div>
        </div>
      </header>

      <main>
        {view === 'home' && <section className="hero-section" id="hero">
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <span className="hero-badge">{ui.hero.eyebrow}</span>
              <TypewriterIntro text={ui.hero.intro1} lang={lang} />
              <h1>{ui.hero.title}</h1>
              <div className="hero-subtitle">
                {ui.hero.subtitle.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="cta-row">
                <Link className="primary-button" id="run-surprise" href="/surprise">{ui.hero.mainButton}</Link>
                <Link className="secondary-button" href="/story">{ui.hero.secondaryButton}</Link>
              </div>
              <div className="meta-row">
                {techBadges[lang].map((item) => (
                  <span key={item} className="meta-pill">{item}</span>
                ))}
              </div>
            </div>

            <div className="hero-card reveal">
              <div className="code-mockup">
                <div className="mockup-topbar">
                  <div className="window-controls">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="mock-file">girls-day.js</span>
                </div>
                <div className="mockup-body ltr-code">
                  <span className="code-key">const</span> specialGirl = {'{'}<br />
                  &nbsp;&nbsp;smile: <span className="code-string">"Beautiful 🌸"</span>,<br />
                  &nbsp;&nbsp;kindness: <span className="code-number">Infinity</span>,<br />
                  &nbsp;&nbsp;dreams: <span className="code-number">Infinity</span>,<br />
                  &nbsp;&nbsp;confidence: <span className="code-string">"100%"</span>,<br />
                  &nbsp;&nbsp;happiness: <span className="code-string">"Loading..."</span>,<br />
                  &nbsp;&nbsp;giveUp: <span className="code-bool">false</span><br />
                  {'};'}
                </div>
              </div>
            </div>
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
              <p>{translations[lang].mainGreeting.message}</p>
              <p>{translations[lang].mainGreeting.paragraph2}</p>
              <p>{translations[lang].mainGreeting.paragraph3}</p>
            </div>
          </div>
        </section>}

        {view === 'story' && <section className="section">
          <div className="container">
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
          </div>
        </section>}

        {view === 'dreams' && <section className="section" id="dream">
          <div className="container">
            <div className="section-heading reveal">
              <h2>{translations[lang].techTitle}</h2>
            </div>
            <div className="tech-grid reveal">
              {translations[lang].techCards.map((card) => (
                <article className="tech-card" key={card.title}>
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
            <SecretDeveloperMode lang={lang} />
          </div>
        </section>}

        {view === 'surprise' && <FinalCelebration lang={lang} />}
      </main>

      <FooterBlock lang={lang} />
    </div>
  );
}
