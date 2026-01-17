'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Users, Truck, Shield, Award, TrendingUp, Globe, Leaf,
  Target, Zap, CheckCircle2, Star, ArrowRight, Play, Quote,
  Package, Clock, Sparkles, MapPin, Calendar, Trophy
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

/**
 * Swift Grocers — Our Story (About Us)
 * Excellence-driven, professional, immersive storytelling experience
 * Showcases brand mission, values, team, achievements, and vision
 */

const coreValues = [
  {
    Icon: Heart,
    title: 'Customer First',
    description: 'Every decision we make starts with one question: How does this serve our customers better?',
    color: 'from-red-500 to-pink-500',
    bg: 'bg-red-50'
  },
  {
    Icon: Leaf,
    title: 'Sustainability',
    description: 'We source responsibly, reduce waste, and support local farmers to protect our planet.',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50'
  },
  {
    Icon: Shield,
    title: 'Quality Promise',
    description: 'From farm to doorstep, we ensure every product meets our rigorous quality standards.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50'
  },
  {
    Icon: Zap,
    title: 'Innovation',
    description: 'We embrace technology to make grocery shopping faster, easier, and more delightful.',
    color: 'from-purple-500 to-indigo-500',
    bg: 'bg-purple-50'
  }
];

const milestones = [
  { year: '2019', title: 'Foundation', description: 'Swift Grocers was born in Lagos with a single warehouse and a vision.' },
  { year: '2020', title: 'Expansion', description: 'Launched in Abuja and Port Harcourt, serving 100,000+ customers.' },
  { year: '2022', title: 'Innovation', description: 'Introduced same-day delivery and mobile app with 500K+ downloads.' },
  { year: '2024', title: 'Recognition', description: 'Named "Best Online Grocer in West Africa" by eCommerce Awards.' },
  { year: '2025', title: 'Growth', description: 'Serving 1M+ customers across Nigeria with 50+ partner farms.' }
];

const stats = [
  { value: '1M+', label: 'Happy Customers', Icon: Users },
  { value: '50K+', label: 'Daily Deliveries', Icon: Truck },
  { value: '15K+', label: 'Products', Icon: Package },
  { value: '98%', label: 'Satisfaction Rate', Icon: Star }
];

const team = [
  {
    name: 'Adebayo Okonkwo',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Former tech executive with 15+ years in eCommerce innovation.'
  },
  {
    name: 'Amina Mohammed',
    role: 'Chief Operations Officer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    bio: 'Logistics expert passionate about seamless delivery experiences.'
  },
  {
    name: 'Chukwuemeka Nwankwo',
    role: 'Head of Sustainability',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    bio: 'Environmental advocate building partnerships with local farmers.'
  },
  {
    name: 'Fatima Bello',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    bio: 'AI and data science leader revolutionizing grocery tech.'
  }
];

const testimonials = [
  {
    quote: 'Swift Grocers changed how my family shops. Fresh produce at my door in hours — it\'s magic!',
    author: 'Mrs. Adeyemi',
    location: 'Lagos',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
  },
  {
    quote: 'As a busy professional, I can\'t imagine life without Swift Grocers. Reliable, fast, and quality products.',
    author: 'David Okoro',
    location: 'Abuja',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  },
  {
    quote: 'The customer service is exceptional. They truly care about every order and every customer.',
    author: 'Grace Ibe',
    location: 'Port Harcourt',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
  }
];

export default function AboutUsPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white font-[Montserrat] text-gray-900">
      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 text-white overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-white blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute right-10 bottom-10 w-[500px] h-[500px] rounded-full bg-yellow-300 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-semibold">Est. 2019 • Serving 1M+ Nigerians</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              Fresh Groceries,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Delivered with Care
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 text-xl md:text-2xl text-green-50 leading-relaxed">
              We're reimagining grocery shopping for Nigeria — combining technology, 
              sustainability, and exceptional service to bring fresh produce to your doorstep.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setVideoPlaying(true)}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                <Play className="w-5 h-5" />
                Watch Our Story
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-20 fill-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </motion.section>

      {/* STATS BAR */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 mb-4">
                  <stat.Icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  {stat.value}
                </div>
                <div className="mt-2 text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm mb-4">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Making Fresh, Quality Groceries 
                <span className="text-green-600"> Accessible to All</span>
              </h2>
              <div className="mt-6 space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Founded in 2019, Swift Grocers began with a simple belief: every Nigerian family 
                  deserves access to fresh, quality groceries without the hassle of crowded markets 
                  and long queues.
                </p>
                <p>
                  What started as a small warehouse in Lagos has grown into Nigeria's most trusted 
                  online grocery platform, serving over 1 million customers across three major cities.
                </p>
                <p>
                  We partner directly with local farmers and trusted suppliers to ensure you receive 
                  the freshest produce, delivered safely to your door — often within hours of your order.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">Same-Day Delivery</span>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">Local Partnerships</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop"
                  alt="Fresh groceries"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="text-3xl font-bold">Fresh from farm to table</div>
                  <div className="mt-2 text-lg text-white/90">Sourced daily, delivered with care</div>
                </div>
              </div>
              
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2024</div>
                    <div className="text-sm text-gray-600">Best Grocer</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm mb-4">
              <Heart className="w-4 h-4" />
              Our Values
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              What Drives Us Forward
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values shape every decision we make and every product we deliver
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {coreValues.map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-green-200 transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl ${value.bg} flex items-center justify-center mb-6`}>
                  <value.Icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r ${value.color}`} style={{ stroke: 'url(#gradient)' }} />
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm mb-4">
              <Calendar className="w-4 h-4" />
              Our Journey
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Milestones That Matter
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-200 via-green-400 to-green-600 hidden lg:block" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="space-y-12"
            >
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className={`inline-block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow ${idx % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'} max-w-md`}>
                      <div className="text-sm font-bold text-green-600 mb-2">{milestone.year}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <div className="w-8 h-8 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm mb-4">
              <Users className="w-4 h-4" />
              Meet Our Team
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              The People Behind Swift Grocers
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Led by passionate innovators committed to transforming grocery shopping in Nigeria
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <div className="text-green-600 font-semibold mt-1 mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gradient-to-br from-green-700 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Quote className="w-16 h-16 mx-auto mb-6 text-green-300 opacity-50" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-8">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].author}
                    className="w-16 h-16 rounded-full border-4 border-white/30"
                  />
                  <div className="text-left">
                    <div className="font-bold text-lg">{testimonials[activeTestimonial].author}</div>
                    <div className="text-green-200">{testimonials[activeTestimonial].location}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeTestimonial ? 'bg-white w-8' : 'bg-white/30'
                  }`}
                  aria-label={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-5xl mx-auto px-6 text-center"
        >
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 md:p-16">
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-green-600" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Ready to Experience the Swift Grocers Difference?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join over 1 million satisfied customers and get your groceries delivered fresh to your doorstep today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all"
              >
                <Users className="w-5 h-5" />
                Join Our Team
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {videoPlaying && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
              onClick={() => setVideoPlaying(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setVideoPlaying(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all"
                >
                  ✕
                </button>
                <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Play className="w-20 h-20 mx-auto mb-4 text-green-600" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Story Video</h3>
                    <p className="text-gray-600">Video player would be embedded here</p>
                    <p className="text-sm text-gray-500 mt-4">(YouTube/Vimeo integration)</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
    <Footer />
    </>
  );
}