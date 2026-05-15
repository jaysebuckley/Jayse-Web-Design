/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, ChangeEvent, FormEvent, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  CheckCircle2, 
  Hammer, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Menu, 
  X,
  Laptop,
  Globe,
  Settings,
  MessageSquare,
  Zap,
  Award,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  db, 
  collection, 
  addDoc, 
  serverTimestamp, 
  signInWithPopup, 
  googleProvider,
  handleFirestoreError,
  OperationType,
  testConnection
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      const leadsRef = collection(db, 'leads');
      await addDoc(leadsRef, {
        ...formData,
        createdAt: serverTimestamp()
      });
      setFormStatus('success');
      setFormData({ name: '', businessName: '', phone: '', email: '', message: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'leads');
      alert('There was an error sending your message. Please try again or call us directly.');
      setFormStatus('idle');
    }
  };

  const handleAdminLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAdmin(true);
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  // Check if current user is the owner
  const isOwner = currentUser?.email === 'jaysebuckley@gmail.com';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  if (showAdmin && isOwner) {
    return <AdminDashboard onClose={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-gold/30 selection:text-brand-navy">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-navy/10 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-navy rounded-lg flex items-center justify-center">
              <span className="text-brand-cream font-serif font-bold text-xl">J</span>
            </div>
            <span className="text-brand-navy font-serif font-bold text-xl hidden sm:inline">Jayse Web Design</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('services')} className="nav-link">Services</button>
            <button onClick={() => scrollToSection('how-it-works')} className="nav-link">How It Works</button>
            <button onClick={() => scrollToSection('reviews')} className="nav-link">Reviews</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:9842204550" className="flex items-center gap-2 text-brand-navy font-medium hover:text-brand-gold transition-colors">
              <Phone size={18} />
              <span>984-220-4550</span>
            </a>
            <button onClick={() => scrollToSection('contact')} className="btn-primary py-2 px-5 text-sm">
              Get a Free Quote
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-brand-navy" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-brand-cream border-b border-brand-navy/10 md:hidden p-6 shadow-xl"
            >
              <div className="flex flex-col gap-6">
                <button onClick={() => scrollToSection('services')} className="nav-link text-lg text-left">Services</button>
                <button onClick={() => scrollToSection('how-it-works')} className="nav-link text-lg text-left">How It Works</button>
                <button onClick={() => scrollToSection('reviews')} className="nav-link text-lg text-left">Reviews</button>
                <button onClick={() => scrollToSection('contact')} className="nav-link text-lg text-left">Contact</button>
                <hr className="border-brand-navy/10" />
                <a href="tel:9842204550" className="flex items-center gap-3 text-brand-navy font-semibold text-lg">
                  <Phone size={20} />
                  <span>984-220-4550</span>
                </a>
                <button onClick={() => scrollToSection('contact')} className="btn-primary w-full shadow-lg">
                  Get a Free Quote
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-12 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl text-brand-navy leading-tight mb-6">
                You deserve a website that works as hard as you do.
              </h1>
              <p className="text-xl md:text-2xl text-brand-navy/80 mb-10 leading-relaxed">
                We help North Carolina small businesses build a professional online presence with sites engineered for performance and built on a foundation of honesty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => scrollToSection('contact')} className="btn-primary text-lg px-8 py-4">
                  Get a Free Quote
                </button>
                <a href="tel:9842204550" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
                  <Phone size={20} />
                  Call 984-220-4550
                </a>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden hidden lg:block">
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 0.05, x: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="absolute -top-12 -right-24 text-[30rem] font-serif font-bold text-brand-navy"
            >
              NC
            </motion.div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-brand-navy py-12 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Award className="text-brand-gold" />, text: "NC State Engineers" },
                { icon: <ShieldCheck className="text-brand-gold" />, text: "Honest Pricing" },
                { icon: <MapPin className="text-brand-gold" />, text: "Local to North Carolina" },
                { icon: <Zap className="text-brand-gold" />, text: "Fast Turnaround" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-3 text-lg font-medium">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl text-brand-navy mb-4">Our Services</h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-6"></div>
              <p className="text-lg text-brand-navy/70 max-w-2xl mx-auto">
                Straightforward solutions tailored to your business goals. No corporate fluff, just quality engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: <Laptop className="text-brand-navy" size={32} />,
                  title: "Starter Site",
                  desc: "A clean, effective landing page to get your business online quickly and affordably. Perfect for service providers.",
                  price: "Simple, Fast, Affordable"
                },
                {
                  icon: <Globe className="text-brand-navy" size={32} />,
                  title: "Business Site",
                  desc: "A complete, multi-page professional website designed to build trust and capture leads automatically.",
                  price: "Full-featured, Professional"
                },
                {
                  icon: <Settings className="text-brand-navy" size={32} />,
                  title: "Custom Build",
                  desc: "Unique solutions for businesses with specific needs. We build from scratch so your site works exactly how you need it.",
                  price: "Tailored from Scratch"
                }
              ].map((service, i) => (
                <div key={i} className="group border border-brand-navy/10 p-10 rounded-2xl bg-brand-cream/30 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="mb-6 p-4 bg-brand-navy/5 rounded-xl w-fit group-hover:bg-brand-gold/10 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl text-brand-navy mb-4">{service.title}</h3>
                  <p className="text-brand-navy/70 mb-6 flex-grow leading-relaxed">{service.desc}</p>
                  <p className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-6">{service.price}</p>
                  <button onClick={() => scrollToSection('contact')} className="text-brand-navy font-bold flex items-center gap-1 group/link">
                    Get a Quote <ChevronRight size={18} className="translate-x-0 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={() => scrollToSection('contact')} className="btn-primary text-lg">
                Not sure what you need? Let's talk.
              </button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-brand-cream/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl text-brand-navy mb-4">How It Works</h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector Lines (Desktop) */}
              <div className="hidden md:block absolute top-[2.5rem] left-[20%] right-[20%] h-0.5 bg-brand-navy/10 z-0"></div>

              {[
                { 
                  step: "01",
                  title: "Free Consultation",
                  desc: "We talk about your business, your goals, and what you actually need. No high-pressure sales.",
                  icon: <MessageSquare size={24} className="text-white" />
                },
                { 
                  step: "02",
                  title: "We Design & Build",
                  desc: "Our NC State engineers build your site with precision, keeping you updated every step of the way.",
                  icon: <Hammer size={24} className="text-white" />
                },
                { 
                  step: "03",
                  title: "You Launch & Grow",
                  desc: "We handle the technical launch. You get a tool that starts working for you immediately.",
                  icon: <Zap size={24} className="text-white" />
                }
              ].map((step, i) => (
                <div key={i} className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-brand-navy rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border-4 border-brand-cream group hover:bg-brand-gold transition-colors duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-serif text-brand-navy mb-4">{step.title}</h3>
                  <p className="text-brand-navy/70 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-4xl md:text-5xl text-brand-navy mb-6">Built by engineers, driven by integrity.</h2>
                <p className="text-xl text-brand-navy/70 mb-10 leading-relaxed">
                  We're not just another marketing agency. We're NC State engineers who believe in doing the job right the first time. Our Christian values mean you get honesty, transparency, and a website that actually works.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { icon: <Award className="text-brand-gold" />, title: "Engineer-Built Quality", desc: "Solid code for fast, reliable sites." },
                    { icon: <ShieldCheck className="text-brand-gold" />, title: "Honest Pricing", desc: "No hidden fees or surprise upselling." },
                    { icon: <Clock className="text-brand-gold" />, title: "Fast Communication", desc: "You'll never wonder where we are." },
                    { icon: <MapPin className="text-brand-gold" />, title: "Rooted in NC", desc: "Based right here in North Carolina." }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-3 mb-2">
                        {item.icon}
                        <h4 className="font-bold text-brand-navy">{item.title}</h4>
                      </div>
                      <p className="text-sm text-brand-navy/60">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 bg-brand-navy/5 p-8 rounded-3xl relative">
                {/* Real Testimonial */}
                <div id="reviews" className="bg-white p-10 rounded-2xl shadow-xl relative z-10 border-l-8 border-brand-gold">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => <Zap key={i} size={16} fill="#D4AF37" className="text-brand-gold" />)}
                  </div>
                  <p className="text-xl text-brand-navy/90 italic mb-8 leading-relaxed font-serif">
                    "Jayse Web Design completely transformed our online presence. The website looks professional, runs smoothly, and had amazing customer service. Great communication, fast turnaround, and an overall amazing experience."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center font-bold text-brand-navy">M</div>
                    <div>
                      <p className="font-bold text-brand-navy">MIZLLC</p>
                      <p className="text-sm text-brand-navy/60">Verified Client</p>
                    </div>
                  </div>
                </div>
                {/* Decorative Dots */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 pointer-events-none">
                  <div className="grid grid-cols-4 gap-4">
                    {[...Array(16)].map((_, i) => <div key={i} className="w-2 h-2 bg-brand-navy rounded-full"></div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-brand-navy text-brand-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div>
                <h2 className="text-4xl md:text-6xl mb-8">Ready to get started? Let's talk.</h2>
                <p className="text-xl text-brand-cream/80 mb-12 max-w-lg leading-relaxed">
                  Call us today for a free consultation. We'll listen to your needs and give you a straightforward path to getting your business online.
                </p>
                
                <div className="flex flex-col gap-6">
                  <a href="tel:9842204550" className="flex items-center gap-5 group">
                    <div className="w-14 h-14 bg-brand-gold rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                      <Phone size={24} className="text-brand-navy" />
                    </div>
                    <div>
                      <p className="text-brand-cream/60 text-sm uppercase tracking-widest mb-1">Call Anytime</p>
                      <p className="text-2xl font-bold font-serif underline decoration-brand-gold underline-offset-4 decoration-2">984-220-4550</p>
                    </div>
                  </a>

                  <a href="mailto:jaysebuckley@gmail.com" className="flex items-center gap-5 group">
                    <div className="w-14 h-14 bg-brand-cream/10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                      <Mail size={24} className="text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-brand-cream/60 text-sm uppercase tracking-widest mb-1">Email Us</p>
                      <p className="text-xl font-bold font-serif group-hover:text-brand-gold transition-colors">jaysebuckley@gmail.com</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 text-brand-navy shadow-2xl relative overflow-hidden">
                {formStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-3xl font-serif mb-4">Message Sent!</h3>
                    <p className="text-lg text-brand-navy/70 mb-8">
                      Thank you for reaching out. We'll be in touch within 24 hours to schedule your consultation.
                    </p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="text-brand-navy font-bold underline underline-offset-4"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-brand-navy/60">Full Name</label>
                        <input 
                          required
                          type="text" 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-navy/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="businessName" className="text-sm font-bold uppercase tracking-wider text-brand-navy/60">Business Name</label>
                        <input 
                          required
                          type="text" 
                          id="businessName"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-navy/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
                          placeholder="Acme Co."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-brand-navy/60">Phone Number</label>
                        <input 
                          required
                          type="tel" 
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-navy/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
                          placeholder="984-220-4550"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-brand-navy/60">Email Address</label>
                        <input 
                          required
                          type="email" 
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-navy/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-brand-navy/60">How can we help?</label>
                      <textarea 
                        required
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-navy/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
                        placeholder="Tell us about your project..."
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={formStatus === 'submitting'}
                      className="btn-primary w-full py-4 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : 'Send Message'}
                    </button>
                    <p className="text-center text-xs text-brand-navy/40">
                      We respect your privacy and will never share your information.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-cream py-16 border-t border-brand-navy/5 text-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center font-serif font-bold text-2xl text-brand-cream shadow-lg">J</div>
              <span className="text-2xl font-serif font-bold tracking-tight">Jayse Web Design</span>
            </div>
            
            <div className="flex flex-wrap gap-8 text-sm font-medium">
              <button onClick={() => scrollToSection('services')} className="nav-link">Services</button>
              <button onClick={() => scrollToSection('how-it-works')} className="nav-link">How It Works</button>
              <button onClick={() => scrollToSection('reviews')} className="nav-link">Reviews</button>
              <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
            </div>

            <div className="flex flex-col gap-3">
              <a href="tel:9842204550" className="flex items-center gap-2 font-bold hover:text-brand-gold transition-colors">
                <Phone size={18} />
                <span>984-220-4550</span>
              </a>
              <a href="mailto:jaysebuckley@gmail.com" className="flex items-center gap-2 font-medium text-brand-navy/60 hover:text-brand-gold transition-colors">
                <Mail size={18} />
                <span>jaysebuckley@gmail.com</span>
              </a>
            </div>
          </div>
          
          <div className="pt-12 border-t border-brand-navy/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-brand-navy/50">
              © 2025 Jayse Web Design. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={isOwner ? () => setShowAdmin(true) : handleAdminLogin}
                className="text-brand-navy/20 hover:text-brand-navy/40 transition-colors"
                title="Admin Login"
              >
                <Lock size={14} />
              </button>
              <div className="flex items-center gap-1 text-sm bg-brand-navy/5 px-4 py-2 rounded-full">
                <MapPin size={14} className="text-brand-gold" />
                <span className="text-brand-navy/70">Proudly serving all of North Carolina</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Call CTA (Mobile only) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        className="md:hidden fixed bottom-6 right-6 z-40"
      >
        <a 
          href="tel:9842204550" 
          className="flex items-center justify-center w-16 h-16 bg-brand-gold text-white rounded-full shadow-2xl pulse-animation"
        >
          <Phone size={28} />
        </a>
      </motion.div>
    </div>
  );
}

