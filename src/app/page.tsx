"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/* ─── Scroll fade-in ─── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={`will-change-[transform,opacity] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      } ${className}`}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "7000ms",
        transitionTimingFunction: "cubic-bezier(0.03, 0.6, 0.08, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Header ─── */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y > lastScrollY.current && y > 120) setHidden(true);
      else setHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "会社概要", id: "about" },
    { label: "事業内容", id: "service" },
    { label: "会社情報", id: "company" },
    { label: "お問い合わせ", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled || menuOpen
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <a
            href="/"
            className={`text-2xl font-bold tracking-[0.2em] transition-colors duration-300 ${
              scrolled || menuOpen ? "text-[#1a2744]" : "text-white"
            }`}
          >
            RHY
          </a>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-10">
            {links.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => nav(e, item.id)}
                className={`text-[13px] tracking-wider transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:transition-all after:duration-300 hover:after:w-full ${
                  scrolled
                    ? "text-[#1a2744] after:bg-[#1a2744]"
                    : "text-white after:bg-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                scrolled || menuOpen ? "text-[#1a2744]" : "text-white"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ${
            menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="pb-6 pt-2 flex flex-col gap-5">
            {links.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => nav(e, item.id)}
                className="text-sm tracking-wider text-[#1a2744]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero Slider ─── */
const slides = [
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
    sub: "Real Estate Brokerage",
    title: "お客様の理想の暮らしを\n不動産仲介で支える",
    desc: "合同会社RHYは、大阪を拠点に不動産の売買・賃貸仲介を行っております。",
  },
  {
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
    sub: "Trust & Quality",
    title: "地域に根ざした\n信頼と実績",
    desc: "お客様一人ひとりのご要望に丁寧に寄り添い、最適な物件をご提案いたします。",
  },
  {
    image: "https://images.unsplash.com/photo-1582407947092-45c027cdd11f?w=1920&q=80",
    sub: "Total Support",
    title: "売買から賃貸まで\nトータルサポート",
    desc: "物件探しから契約・引渡しまで、安心のサポートをご提供します。",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(idx);
      setTimeout(() => setAnimating(false), 4500);
    },
    [animating]
  );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 12000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 will-change-[opacity] ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{
            transitionProperty: "opacity",
            transitionDuration: "4000ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="absolute inset-0 will-change-transform">
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-cover will-change-transform"
              style={{
                transitionProperty: "transform",
                transitionDuration: "18000ms",
                transitionTimingFunction: "cubic-bezier(0.15, 0, 0.25, 1)",
                transform: i === current ? "scale(1.08)" : "scale(1)",
              }}
              priority={i === 0}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2744]/80 via-[#1a2744]/40 to-transparent" />

          {/* Text */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
              <div
                className={`max-w-xl will-change-[transform,opacity] ${
                  i === current
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionProperty: "opacity, transform",
                  transitionDuration: "3500ms",
                  transitionDelay: "800ms",
                  transitionTimingFunction: "cubic-bezier(0.03, 0.6, 0.08, 1)",
                }}
              >
                <p className="text-[11px] tracking-[0.3em] uppercase text-white/70 mb-5">
                  {slide.sub}
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold text-white leading-[1.5] whitespace-pre-line mb-6">
                  {slide.title}
                </h2>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                  {slide.desc}
                </p>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group inline-flex items-center gap-3 text-white text-sm tracking-wider border border-white/40 px-8 py-3.5 rounded-sm hover:bg-white hover:text-[#1a2744] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  お問い合わせ
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-[3px] rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              i === current ? "w-10 bg-white" : "w-5 bg-white/40"
            }`}
            aria-label={`スライド${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-10 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.2em] text-white/60 uppercase" style={{ writingMode: "vertical-rl" }}>
          Scroll
        </span>
        <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
          <div className="w-full h-8 bg-white/80 absolute animate-[scrollLine_2.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}

/* ─── News ─── */
function News() {
  const [news, setNews] = useState<
    { id: string; title: string; content: string; published_at: string | null }[]
  >([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || news.length === 0) return null;

  const isNew = (dateStr: string | null) => {
    if (!dateStr) return false;
    return Date.now() - new Date(dateStr).getTime() < 24 * 60 * 60 * 1000;
  };

  return (
    <section id="news" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1a2744]/50 mb-3">
              News
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a2744] mb-2">
              お知らせ
            </h2>
            <div className="w-10 h-[2px] bg-[#1a2744] mx-auto" />
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="max-w-3xl mx-auto divide-y divide-slate-100">
            {news.map((item) => (
              <div key={item.id} className="py-5 flex items-start gap-4">
                <span className="text-sm text-[#1a2744]/40 shrink-0 w-[100px] pt-0.5">
                  {item.published_at
                    ? new Date(item.published_at).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : ""}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-medium text-[#1a2744]">
                      {item.title}
                    </p>
                    {isNew(item.published_at) && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold shrink-0">
                        NEW
                      </span>
                    )}
                  </div>
                  {item.content && (
                    <p className="text-sm text-[#1a2744]/60 mt-1 line-clamp-2">
                      {item.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  const photos = [
    { src: "/images/office-door.jpg", alt: "RHYオフィス入口" },
    { src: "/images/office-entrance.jpg", alt: "オフィス受付" },
    { src: "/images/office-interior-1.jpg", alt: "オフィス内観" },
    { src: "/images/office-interior-2.jpg", alt: "ワークスペース" },
  ];

  return (
    <section id="about" className="py-28 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-20 md:mb-28">
            <p className="text-[11px] tracking-[0.4em] uppercase text-[#1a2744]/40 mb-4">
              About
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#1a2744] tracking-wide">
              会社概要
            </h2>
            <div className="w-10 h-[1px] bg-[#1a2744]/30 mx-auto mt-6" />
          </div>
        </FadeIn>

        {/* Main content: image + text */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-32">
          <FadeIn delay={200}>
            <div className="relative aspect-[4/3] rounded overflow-hidden">
              <Image
                src="/images/building-exterior.jpg"
                alt="三好ビル外観"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={400}>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#1a2744] leading-[1.8] mb-8">
                お客様の理想の暮らしを、
                <br />
                不動産仲介で支える。
              </h3>
              <p className="text-[#555] leading-[2.2] text-[15px] mb-6">
                合同会社RHYは2021年の設立以来、大阪を中心に不動産仲介業を展開しております。
                お客様のライフスタイルやご予算に合わせた最適な物件をご提案し、
                売買から賃貸まで幅広くサポートいたします。
              </p>
              <p className="text-[#555] leading-[2.2] text-[15px]">
                地域に根ざした情報力と、お客様第一のサービスで、
                安心・信頼のお取引をお約束いたします。
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Photo row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <FadeIn key={photo.src} delay={300 + i * 200}>
              <div className="relative aspect-[3/2] rounded overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Service ─── */
function Service() {
  const services = [
    {
      title: "売買仲介",
      desc: "マイホームの購入から投資用物件まで、お客様のニーズに合った不動産の売買をサポートいたします。",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
    },
    {
      title: "賃貸仲介",
      desc: "お住まいやオフィス・店舗の賃貸物件をお探しの方へ、ご希望の条件に合った物件をご紹介いたします。",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      ),
    },
    {
      title: "不動産コンサルティング",
      desc: "資産活用や相続対策など、お客様の状況に応じた最適なアドバイスをご提供します。",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
    },
  ];

  return (
    <section id="service" className="py-24 md:py-32 bg-[#f7f8fa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1a2744]/50 mb-3">
              Service
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a2744] mb-2">
              事業内容
            </h2>
            <div className="w-10 h-[2px] bg-[#1a2744] mx-auto" />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <FadeIn key={s.title} delay={i * 200}>
              <div className="bg-white rounded overflow-hidden shadow-sm relative">
                <div className="h-[3px] bg-[#1a2744]" />
                <div className="p-10">
                  <div className="w-14 h-14 rounded-full bg-[#1a2744]/5 border border-[#1a2744]/10 flex items-center justify-center mb-6">
                    <svg
                      className="w-7 h-7 text-[#1a2744]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {s.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#1a2744] mb-4">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#666] leading-[1.9]">{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Numbers / Highlights ─── */
function Numbers() {
  return (
    <section className="py-20 bg-[#1a2744] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "2021", label: "設立年" },
            { num: "大阪", label: "拠点" },
            { num: "300万円", label: "資本金" },
            { num: "12", label: "事業領域" },
          ].map((item, i) => (
            <FadeIn key={item.label} delay={i * 200}>
              <div>
                <p className="text-2xl md:text-3xl font-bold tracking-wider mb-2">
                  {item.num}
                </p>
                <p className="text-[11px] tracking-[0.2em] text-white/60 uppercase">
                  {item.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Company Info ─── */
function CompanyInfo() {
  const info = [
    { label: "商号", value: "合同会社RHY" },
    {
      label: "所在地",
      value:
        "〒537-0002\n大阪市東成区深江北一丁目3番5号\n三好ビル306",
    },
    { label: "代表取締役社長", value: "鯰江 清裕" },
    { label: "設立", value: "2021年8月3日" },
    { label: "資本金", value: "300万円" },
    {
      label: "事業内容",
      value: "不動産売買仲介\n不動産賃貸仲介\n不動産コンサルティング",
    },
  ];

  return (
    <section id="company" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1a2744]/50 mb-3">
              Company
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a2744] mb-2">
              会社情報
            </h2>
            <div className="w-10 h-[2px] bg-[#1a2744] mx-auto" />
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="max-w-3xl mx-auto">
            <dl>
              {info.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-4 py-6 border-b border-[#e5e7eb]"
                >
                  <dt className="text-sm font-medium text-[#1a2744]">
                    {item.label}
                  </dt>
                  <dd className="text-sm text-[#555] whitespace-pre-line leading-relaxed">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="max-w-3xl mx-auto mt-14">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.3!2d135.5547!3d34.6709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e0a0a0a0a0a0%3A0x0!2z5aSn6Ziq5biC5p2x5oiQ5Yy65rex5rGf5YyX5LiA5LiB55uu77yT55Wq77yV5Y-3!5e0!3m2!1sja!2sjp!4v1"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

const devDefaults: Record<string, string> = {
  name: "山田 太郎",
  email: "info@kakushin-gijutu.com",
  phone: "06-6224-0002",
  type: "rent",
  message: "賃貸物件についてお問い合わせいたします。大阪市内で2LDK、家賃15万円以内の物件を探しております。",
};

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          type: form.get("type"),
          message: form.get("message"),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "送信に失敗しました");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "送信に失敗しました");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#f7f8fa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#1a2744]/50 mb-3">
              Contact
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a2744] mb-2">
              お問い合わせ
            </h2>
            <div className="w-10 h-[2px] bg-[#1a2744] mx-auto mb-6" />
            <p className="text-sm text-[#777] max-w-md mx-auto">
              不動産に関するご相談・お問い合わせは、下記フォームよりお気軽にご連絡ください。
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="max-w-xl mx-auto">
            {submitted ? (
              <div className="text-center py-16 bg-white rounded shadow-sm">
                <svg
                  className="w-14 h-14 text-green-500 mx-auto mb-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-lg font-bold text-[#1a2744] mb-2">
                  送信が完了しました
                </p>
                <p className="text-sm text-[#777]">
                  内容を確認の上、折り返しご連絡いたします。
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow-sm p-10 space-y-7"
              >
                {[
                  { id: "name", label: "お名前", type: "text", required: true },
                  { id: "email", label: "メールアドレス", type: "email", required: true },
                  { id: "phone", label: "電話番号", type: "tel", required: false },
                ].map((f) => (
                  <div key={f.id}>
                    <label
                      htmlFor={f.id}
                      className="block text-sm font-medium text-[#1a2744] mb-2"
                    >
                      {f.label}
                      {f.required && (
                        <span className="text-red-500 ml-1 text-xs">必須</span>
                      )}
                    </label>
                    <input
                      type={f.type}
                      id={f.id}
                      name={f.id}
                      required={f.required}
                      defaultValue={isDev ? devDefaults[f.id] : undefined}
                      className="w-full border border-[#ddd] rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30 focus:border-[#1a2744] transition-all duration-200 bg-[#fafafa]"
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-[#1a2744] mb-2"
                  >
                    お問い合わせ種別
                  </label>
                  <select
                    id="type"
                    name="type"
                    defaultValue={isDev ? devDefaults.type : ""}
                    className="w-full border border-[#ddd] rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30 focus:border-[#1a2744] transition-all duration-200 bg-[#fafafa]"
                  >
                    <option value="">選択してください</option>
                    <option value="buy">物件の購入について</option>
                    <option value="sell">物件の売却について</option>
                    <option value="rent">賃貸物件について</option>
                    <option value="consult">不動産に関するご相談</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#1a2744] mb-2"
                  >
                    お問い合わせ内容
                    <span className="text-red-500 ml-1 text-xs">必須</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    defaultValue={isDev ? devDefaults.message : undefined}
                    className="w-full border border-[#ddd] rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30 focus:border-[#1a2744] transition-all duration-200 resize-none bg-[#fafafa]"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#1a2744] text-white py-4 rounded hover:bg-[#263a5e] transition-all duration-300 text-sm font-medium tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "送信中..." : "送信する"}
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const nav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-2xl font-bold tracking-[0.2em] mb-4">RHY</p>
            <p className="text-sm text-white/50 leading-[1.9]">
              合同会社RHY
              <br />
              〒537-0002
              <br />
              大阪市東成区深江北一丁目3番5号
              <br />
              三好ビル306
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/40 mb-5">
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { label: "会社概要", id: "about" },
                { label: "事業内容", id: "service" },
                { label: "会社情報", id: "company" },
                { label: "お問い合わせ", id: "contact" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => nav(e, item.id)}
                  className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/40 mb-5">
              Business Hours
            </p>
            <p className="text-sm text-white/50 leading-[1.9]">
              平日 9:00 – 18:00
              <br />
              土日祝 定休日
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">
          <p className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} 合同会社RHY. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[11px] tracking-wider text-white/40 hover:text-white transition-colors flex items-center gap-2"
          >
            TOP
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ─── JSON-LD ─── */
function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": "https://r-h-y.jp/#organization",
        name: "合同会社RHY",
        url: "https://r-h-y.jp",
        logo: "https://r-h-y.jp/images/og-image.jpg",
        image: "https://r-h-y.jp/images/building-exterior.jpg",
        description:
          "合同会社RHYは大阪市東成区を拠点に不動産の売買・賃貸仲介、コンサルティングを行っております。",
        founder: {
          "@type": "Person",
          name: "鯰江 清裕",
          jobTitle: "代表取締役社長",
        },
        foundingDate: "2021-08-03",
        address: {
          "@type": "PostalAddress",
          postalCode: "537-0002",
          addressRegion: "大阪府",
          addressLocality: "大阪市東成区",
          streetAddress: "深江北一丁目3番5号 三好ビル306",
          addressCountry: "JP",
        },
        areaServed: {
          "@type": "City",
          name: "大阪市",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        makesOffer: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "不動産売買仲介",
              description: "マイホームの購入から投資用物件まで、不動産の売買をサポートいたします。",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "不動産賃貸仲介",
              description: "お住まいやオフィス・店舗の賃貸物件をご紹介いたします。",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "不動産コンサルティング",
              description: "資産活用や相続対策など、不動産に関するあらゆるご相談に対応いたします。",
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://r-h-y.jp/#website",
        url: "https://r-h-y.jp",
        name: "合同会社RHY",
        publisher: { "@id": "https://r-h-y.jp/#organization" },
        inLanguage: "ja",
      },
      {
        "@type": "WebPage",
        "@id": "https://r-h-y.jp/#webpage",
        url: "https://r-h-y.jp",
        name: "合同会社RHY | 大阪の不動産売買・賃貸仲介",
        isPartOf: { "@id": "https://r-h-y.jp/#website" },
        about: { "@id": "https://r-h-y.jp/#organization" },
        inLanguage: "ja",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: "https://r-h-y.jp",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Page ─── */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd />
      <Header />
      <HeroSlider />
      <News />
      <About />
      <Service />
      <Numbers />
      <CompanyInfo />
      <ContactForm />
      <Footer />
    </main>
  );
}
