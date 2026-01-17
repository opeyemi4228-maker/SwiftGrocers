'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones, Gift,
  PhoneIncoming, Map, CheckCircle2, AlertCircle, Globe,
  Facebook, Twitter, Instagram, Linkedin, Youtube
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

/**
 * Swift Grocers — Contact Us (Upgraded)
 * - Montserrat-like font usage via tailwind class font-[Montserrat]
 * - Framer Motion entrances & micro-interactions
 * - Animated cards, improved hero, animated FAQ, accessible form with basic validation
 * - Reusable small components for clarity
 *
 * Single-file, production-ready React component suitable for Next.js / app router.
 */

const contactMethods = [
  {
    id: 1,
    Icon: Phone,
    title: 'Call Us',
    description: 'Mon-Fri from 8am to 6pm',
    value: '+234 (0) 803 123 4567',
    link: 'tel:+2348031234567',
    accent: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    Icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team',
    value: 'Start a conversation',
    link: '#',
    accent: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    id: 3,
    Icon: Mail,
    title: 'Email Us',
    description: "We'll respond within 24 hours",
    value: 'support@swiftgrocers.ng',
    link: 'mailto:support@swiftgrocers.ng',
    accent: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    id: 4,
    Icon: MapPin,
    title: 'Visit Us',
    description: 'Come to our office',
    value: 'View on Google Maps',
    link: '#',
    accent: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600'
  }
];

const locations = [
 
  {
    id: 2,
    city: 'Abuja',
    address: 'Prime Mall, Plot C110, 69 Road, 6th Avenue, Abuja',
    phone: '+234 908 720 6986',
    hours: 'Mon-Sat: 8:00 AM - 8:00 PM',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800'
  },
  
];

const faqs = [
  {
    question: 'What are your delivery hours?',
    answer: 'We deliver Monday to Saturday from 8 AM to 8 PM. Same-day delivery is available for orders placed before 2 PM.'
  },
  {
    question: 'Do you deliver to my area?',
    answer: 'We currently deliver across Lagos, Abuja, and Port Harcourt. Enter your postal code at checkout to confirm delivery availability.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer hassle-free returns within 24 hours of delivery. Fresh produce and perishables must be reported within 2 hours of delivery.'
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is dispatched, you\'ll receive a tracking link via SMS and email. You can also track orders in your account dashboard.'
  }
];

export default function ContactUsPage() {
  // form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [openFaq, setOpenFaq] = useState(null);
  const formRef = useRef(null);

  // small entrance animation variants
  const cardVariant = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // validation helper
  const validate = () => {
    if (!formData.name.trim()) return 'Please enter your name.';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) return 'Please enter a valid email.';
    if (!formData.subject.trim()) return 'Please enter a subject.';
    if (!formData.message.trim() || formData.message.length < 10) return 'Message should be at least 10 characters.';
    return null;
  };

  const handleChange = (e) => {
    setFormData(s => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setSubmitStatus({ type: 'error', message: error });
      setTimeout(() => setSubmitStatus(null), 4500);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulated API call (replace with real API integration)
    try {
      await new Promise(r => setTimeout(r, 1400));
      setIsSubmitting(false);
      setSubmitStatus({ type: 'success', message: 'Message sent — we\'ll get back to you shortly.' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' });

      // auto-clear notification
      setTimeout(() => setSubmitStatus(null), 5000);
      // bring focus back to top of form
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      setIsSubmitting(false);
      setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 font-[Montserrat] text-gray-800">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-green-700 to-emerald-600 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -left-10 -top-10 w-96 h-96 rounded-full bg-white blur-3xl opacity-6" />
          <div className="absolute right-6 bottom-6 w-80 h-80 rounded-full bg-yellow-300 blur-3xl opacity-6" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 justify-between">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                  <Headphones className="w-4 h-4 text-white" />
                  24/7 Support
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight">
                  Contact Swift Grocers
                </h1>
                <p className="mt-4 text-lg text-white/90">
                  We’re here to help — whether it’s an order question, vendor inquiry, or product feedback.
                  Use the form or any of the contact channels below.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    href="tel:+2348031234567"
                    className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-3 rounded-full shadow"
                  >
                    <PhoneIncoming className="w-4 h-4" />
                    Call Now
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    href="#contact-form"
                    className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-4 py-3 rounded-full"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message Us
                  </motion.a>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="w-full md:w-96">
              <div className="bg-white rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Avg response time</div>
                    <div className="text-lg font-bold text-green-600">~2 hours</div>
                    <div className="text-sm text-gray-500">Mon–Sat, 8:00–20:00</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">Satisfaction</div>
                    <div className="text-lg font-semibold text-green-700">98%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">Support</div>
                    <div className="text-lg font-semibold text-green-700">24/7</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CONTACT METHODS */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((m, i) => {
            const { Icon } = m;
            return (
              <motion.a
                key={m.id}
                href={m.link}
                variants={cardVariant}
                whileHover={{ translateY: -6, boxShadow: '0 10px 30px rgba(2,6,23,0.08)' }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-transform duration-200 flex flex-col gap-3"
                aria-label={m.title}
              >
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${m.bg}`}>
                  <Icon className={`w-7 h-7 ${m.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900">{m.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{m.description}</div>
                </div>
                <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r py-1 from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0))` }}>
                  <span className={`bg-clip-text text-transparent bg-gradient-to-r ${m.accent}`}>{m.value}</span>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* CONTACT FORM */}
          <motion.div id="contact-form" ref={formRef} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-3xl shadow-xl p-8 lg:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                <p className="text-sm text-gray-600 mt-1">Tell us how we can help and we’ll respond quickly.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Secure & private
              </div>
            </div>

            <AnimatePresence>
              {submitStatus?.type === 'success' && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-green-900">{submitStatus.message}</div>
                    <div className="text-sm text-green-700">We’ll respond within 24 hours.</div>
                  </div>
                </motion.div>
              )}
              {submitStatus?.type === 'error' && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-900">{submitStatus.message}</div>
                    <div className="text-sm text-red-700">Please correct and try again.</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What can we help you with?</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="delivery">Delivery Issues</option>
                  <option value="product">Product Questions</option>
                  <option value="vendor">Become a Vendor</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full name *</label>
                  <input name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@domain.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="+234 803 123 4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input name="subject" value={formData.subject} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Order #1234" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="Tell us about your inquiry..." />
              </div>

              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className={`flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}>
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>

                <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => { setFormData({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' }); setSubmitStatus(null); }} className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700">
                  Clear
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* SIDE INFO */}
          <motion.aside initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.06 }} className="space-y-8">
            {/* Office locations */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Map className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold">Our Locations</h3>
              </div>
              <div className="space-y-4">
                {locations.map((loc, idx) => (
                  <motion.div key={loc.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:pb-0 last:border-0">
                    <img src={loc.image} alt={loc.city} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{loc.city}</div>
                          <div className="text-sm text-gray-600">{loc.address}</div>
                        </div>
                        <div className="text-sm text-gray-500">{loc.hours}</div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" /> {loc.phone}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">Quick Answers</h3>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                    <details className="group" open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)}>
                      <summary className="flex items-center justify-between cursor-pointer bg-white rounded-xl p-3 hover:shadow-sm transition-all">
                        <span className="font-medium text-gray-900">{f.question}</span>
                        <AlertCircle className={`w-5 h-5 text-green-600 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                      </summary>
                      <div className="mt-2 px-3 py-3 text-sm text-gray-700 bg-white rounded-xl">
                        {f.answer}
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-3">Connect With Us</h3>
              <p className="text-sm text-gray-600 mb-4">Follow for deals, product drops and helpful tips.</p>
              <div className="flex gap-3">
                {[ { Icon: Facebook, c: 'bg-blue-600' }, { Icon: Twitter, c: 'bg-sky-500' }, { Icon: Instagram, c: 'bg-pink-500' }, { Icon: Linkedin, c: 'bg-blue-700' }, { Icon: Youtube, c: 'bg-red-600' } ].map((s, idx) => (
                  <motion.a key={idx} whileHover={{ scale: 1.05 }} href="#" className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${s.c} transition-all`} aria-label="social">
                    <s.Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* MAP / LOCATION PLACEHOLDER */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gray-100 rounded-3xl overflow-hidden h-96 shadow-inner flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <div className="text-lg font-semibold text-gray-700">Find us on the map</div>
            <div className="text-sm text-gray-500 mt-2">Interactive map (Google Maps / Mapbox) can be embedded here.</div>
          </div>
        </div>
      </motion.section>

      {/* CTA BOTTOM */}
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-green-700 to-emerald-600 py-14 mt-6">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Still have questions?</h2>
          <p className="mt-2 text-lg text-green-50">Our support team is here to help — reach out via phone or live chat anytime.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <motion.a whileHover={{ scale: 1.03 }} href="tel:+2348031234567" className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-full shadow font-semibold">
              <Phone className="w-4 h-4" /> Call Now
            </motion.a>
            <motion.a whileHover={{ scale: 1.03 }} href="#" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full font-semibold">
              <MessageCircle className="w-4 h-4" /> Live Chat
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
    <Footer />
    </>
  );
}
