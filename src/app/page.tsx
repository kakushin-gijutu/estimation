"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// スクロールで要素をフェードイン表示するフック
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
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 10);
      // 下スクロールで隠す、上スクロールで表示
      if (currentY > lastScrollY.current && currentY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="/"
            className={`text-xl font-bold tracking-wider transition-colors duration-300 ${
              scrolled ? "text-slate-800" : "text-slate-700"
            }`}
          >
            RHY
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "会社概要", id: "about" },
              { label: "事業内容", id: "service" },
              { label: "会社情報", id: "company" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-slate-800 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="text-sm bg-slate-800 text-white px-5 py-2 rounded hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              お問い合わせ
            </a>
          </nav>
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {/* Mobile Nav */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="pb-4 border-t border-slate-100 pt-4 flex flex-col gap-4">
            {[
              { label: "会社概要", id: "about" },
              { label: "事業内容", id: "service" },
              { label: "会社情報", id: "company" },
              { label: "お問い合わせ", id: "contact" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                onClick={(e) => handleNavClick(e, item.id)}
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

function Hero() {
  return (
    <section className="relative pt-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <p className="text-sm font-medium text-slate-500 tracking-widest uppercase mb-4">
              Real Estate Brokerage
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight mb-6">
              お客様の理想の暮らしを
              <br />
              不動産仲介で支える
            </h1>
            <p className="text-slate-600 leading-relaxed mb-8 max-w-md">
              合同会社RHYは、大阪を拠点に不動産の売買・賃貸仲介を行っております。
              お客様一人ひとりのご要望に丁寧に寄り添い、最適な物件をご提案いたします。
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block bg-slate-800 text-white px-8 py-3 rounded hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 text-sm font-medium"
            >
              お問い合わせはこちら
            </a>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <Image
                src="/images/building.jpg"
                alt="合同会社RHY オフィス外観"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-sm font-medium text-slate-500 tracking-widest uppercase mb-3">About</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">会社概要</h2>
            <div className="w-12 h-0.5 bg-slate-800 mx-auto" />
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="max-w-3xl mx-auto">
            <p className="text-slate-600 leading-loose text-center">
              合同会社RHYは2021年の設立以来、大阪を中心に不動産仲介業を展開しております。
              お客様のライフスタイルやご予算に合わせた最適な物件をご提案し、
              売買から賃貸まで幅広くサポートいたします。
              地域に根ざした情報力と、お客様第一のサービスで、
              安心・信頼のお取引をお約束いたします。
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Service() {
  const services = [
    {
      title: "売買仲介",
      description:
        "マイホームの購入から投資用物件まで、お客様のニーズに合った不動産の売買をサポートいたします。物件探しから契約・引渡しまで、安心のトータルサポートをご提供します。",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: "賃貸仲介",
      description:
        "お住まいやオフィス・店舗の賃貸物件をお探しの方へ、ご希望の条件に合った物件をご紹介いたします。入居までスムーズにご案内いたします。",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: "不動産コンサルティング",
      description:
        "不動産に関するあらゆるご相談に対応いたします。資産活用や相続対策など、お客様の状況に応じた最適なアドバイスをご提供します。",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="service" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-sm font-medium text-slate-500 tracking-widest uppercase mb-3">Service</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">事業内容</h2>
            <div className="w-12 h-0.5 bg-slate-800 mx-auto" />
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <FadeIn key={service.title} delay={i * 150}>
              <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-slate-700 mb-5 group-hover:text-slate-900 group-hover:scale-110 transition-all duration-300 inline-block">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompanyInfo() {
  const info = [
    { label: "商号", value: "合同会社RHY" },
    { label: "所在地", value: "〒537-0002\n大阪市東成区深江北一丁目3番5号\n三好ビル306" },
    { label: "代表者", value: "代表社員 鯰江 清裕" },
    { label: "設立", value: "2021年8月3日" },
    { label: "資本金", value: "300万円" },
    { label: "事業内容", value: "不動産売買仲介\n不動産賃貸仲介\n不動産コンサルティング" },
  ];

  return (
    <section id="company" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-sm font-medium text-slate-500 tracking-widest uppercase mb-3">Company</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">会社情報</h2>
            <div className="w-12 h-0.5 bg-slate-800 mx-auto" />
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="max-w-2xl mx-auto">
            <dl className="divide-y divide-slate-100">
              {info.map((item) => (
                <div key={item.label} className="py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-slate-500">{item.label}</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2 text-sm text-slate-800 whitespace-pre-line">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="max-w-2xl mx-auto mt-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.3!2d135.5547!3d34.6709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e0a0a0a0a0a0%3A0x0!2z5aSn6Ziq5biC5p2x5oiQ5Yy65rex5rGf5YyX5LiA5LiB55uu77yT55Wq77yV5Y-3!5e0!3m2!1sja!2sjp!4v1"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-sm font-medium text-slate-500 tracking-widest uppercase mb-3">Contact</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">お問い合わせ</h2>
            <div className="w-12 h-0.5 bg-slate-800 mx-auto" />
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="max-w-xl mx-auto">
            {submitted ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm animate-fade-in">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-lg font-medium text-slate-800 mb-2">送信が完了しました</p>
                <p className="text-sm text-slate-600">内容を確認の上、折り返しご連絡いたします。</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="bg-white rounded-lg shadow-sm p-8 space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full border border-slate-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-shadow duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full border border-slate-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-shadow duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full border border-slate-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-shadow duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
                    お問い合わせ種別
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="w-full border border-slate-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white transition-shadow duration-200"
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
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                    お問い合わせ内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full border border-slate-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none transition-shadow duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-800 text-white py-3 rounded hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm font-medium"
                >
                  送信する
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-lg font-bold tracking-wider mb-3">RHY</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              合同会社RHY
              <br />
              大阪市東成区深江北一丁目3番5号
              <br />
              三好ビル306
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">リンク</p>
            <nav className="flex flex-col gap-2">
              {[
                { label: "会社概要", id: "about" },
                { label: "事業内容", id: "service" },
                { label: "会社情報", id: "company" },
                { label: "お問い合わせ", id: "contact" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">営業時間</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              平日 9:00 - 18:00
              <br />
              土日祝 定休日
            </p>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-10 pt-8 text-center">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} 合同会社RHY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <About />
      <Service />
      <CompanyInfo />
      <ContactForm />
      <Footer />
    </main>
  );
}
