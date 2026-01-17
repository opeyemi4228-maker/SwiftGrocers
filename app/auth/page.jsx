'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Eye, EyeOff, ShoppingCart, CheckCircle2,
  AlertCircle, Loader2, ArrowRight, Shield, Sparkles, X,
  Phone, MapPin, Calendar
} from 'lucide-react';

/**
 * Swift Grocers — Complete Authentication System
 * (AuthAPI, helpers and component already in your snippet)
 * This file contains the finished UI and form markup.
 */

// Simulated Backend API (same as in your snippet)
class AuthAPI {
  static USERS_KEY = 'swift_grocers_users';
  static SESSION_KEY = 'swift_grocers_session';
  static CART_KEY = 'swift_grocers_cart';

  static hashPassword(password) {
    return btoa(password + 'swift_salt_2025');
  }

  static verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  static getUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static async register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers();
        if (users.find(u => u.email === userData.email)) {
          reject({ message: 'Email already registered' });
          return;
        }
        const newUser = {
          id: `user_${Date.now()}`,
          email: userData.email,
          password: this.hashPassword(userData.password),
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone || '',
          address: userData.address || '',
          createdAt: new Date().toISOString(),
          emailVerified: false
        };
        users.push(newUser);
        this.saveUsers(users);

        const session = {
          userId: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          token: btoa(JSON.stringify({ userId: newUser.id, timestamp: Date.now() })),
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        resolve({ user: { ...newUser, password: undefined }, session });
      }, 1000);
    });
  }

  static async signIn(email, password, rememberMe = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);
        if (!user) {
          reject({ message: 'Invalid email or password' });
          return;
        }
        if (!this.verifyPassword(password, user.password)) {
          reject({ message: 'Invalid email or password' });
          return;
        }
        const expiresIn = rememberMe ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000);
        const session = {
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          token: btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() })),
          expiresAt: Date.now() + expiresIn,
          rememberMe
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        resolve({ user: { ...user, password: undefined }, session });
      }, 1000);
    });
  }

  static getSession() {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (!session) return null;
    const parsed = JSON.parse(session);
    if (Date.now() > parsed.expiresAt) {
      this.signOut();
      return null;
    }
    return parsed;
  }

  static signOut() {
    localStorage.removeItem(this.SESSION_KEY);
  }

  static getCart(userId) {
    const allCarts = localStorage.getItem(this.CART_KEY);
    const carts = allCarts ? JSON.parse(allCarts) : {};
    return carts[userId] || [];
  }

  static updateCart(userId, cartItems) {
    const allCarts = localStorage.getItem(this.CART_KEY);
    const carts = allCarts ? JSON.parse(allCarts) : {};
    carts[userId] = cartItems;
    localStorage.setItem(this.CART_KEY, JSON.stringify(carts));
  }

  static async updateProfile(userId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          reject({ message: 'User not found' });
          return;
        }
        users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
        this.saveUsers(users);
        const session = this.getSession();
        if (session) {
          session.firstName = updates.firstName || session.firstName;
          session.lastName = updates.lastName || session.lastName;
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        }
        resolve({ user: { ...users[userIndex], password: undefined } });
      }, 800);
    });
  }
}

// Password strength helpers (same logic)
const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return { score: strength, max: 5 };
};

const getStrengthLabel = (score) => {
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { label: 'Good', color: 'bg-yellow-500' };
  if (score <= 4) return { label: 'Strong', color: 'bg-green-500' };
  return { label: 'Excellent', color: 'bg-emerald-500' };
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('swift_token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validation (same as snippet)
  const validateSignIn = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/signin', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('swift_token', response.token);
      localStorage.setItem('swift_user', JSON.stringify(response.user));
      
      // Dispatch auth update event for Navbar
      window.dispatchEvent(new Event('authUpdated'));
      
      showNotification('success', `Welcome back, ${response.user.firstName}!`);
      setTimeout(() => router.push('/'), 1200);
    } catch (error) {
      showNotification('error', error.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateSignUp()) return;
    
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address
      });

      localStorage.setItem('swift_token', response.token);
      localStorage.setItem('swift_user', JSON.stringify(response.user));
      
      window.dispatchEvent(new Event('authUpdated'));
      
      showNotification('success', `Account created! Welcome, ${response.user.firstName}!`);
      setTimeout(() => router.push('/'), 1200);
    } catch (error) {
      showNotification('error', error.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = formData.password ? calculatePasswordStrength(formData.password) : null;
  const strengthInfo = passwordStrength ? getStrengthLabel(passwordStrength.score) : null;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 font-[Montserrat] flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], x: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30"
        />
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[9999] max-w-md w-full"
          >
            <div className={`rounded-2xl shadow-2xl p-4 flex items-start gap-3 ${
              notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white`}>
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="font-semibold">
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </div>
                <div className="text-sm text-white/90">{notification.message}</div>
              </div>
              <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Auth Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="grid lg:grid-cols-2">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 text-white p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Sparkles className="w-16 h-16 mb-6 text-yellow-300" />
                <h1 className="text-4xl font-extrabold mb-4">Welcome to Swift Grocers</h1>
                <p className="text-xl text-green-50 mb-8 leading-relaxed">
                  Fresh groceries delivered to your doorstep. Join over 1 million satisfied customers.
                </p>

                <div className="space-y-4">
                  {[
                    { Icon: ShoppingCart, text: 'Shop 15,000+ products' },
                    { Icon: Shield, text: 'Secure checkout & payments' },
                    { Icon: CheckCircle2, text: 'Same-day delivery available' }
                  ].map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + idx * 0.1 }} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <item.Icon className="w-5 h-5" />
                      </div>
                      <span className="text-lg">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-8 bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'signin' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  mode === 'signup' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'signin' ? (
                /* Sign In Form (unchanged) */
                <motion.form
                  key="signin"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  onSubmit={handleSignIn}
                  className="space-y-6"
                >
                  <motion.div variants={fadeInUp}>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to access your account</p>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-green-500 transition-colors`}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-green-500 transition-colors`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.password}</p>}
                  </motion.div>

                  <motion.div variants={fadeInUp} className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <span className="text-sm text-gray-700">Remember me</span>
                    </label>
                    <button type="button" className="text-sm font-semibold text-green-600 hover:text-green-700">Forgot password?</button>
                  </motion.div>

                  <motion.button variants={fadeInUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Signing In...</>) : (<>Sign In<ArrowRight className="w-5 h-5" /></>)}
                  </motion.button>
                </motion.form>
              ) : (
                /* Sign Up Form (COMPLETED) */
                <motion.form
                  key="signup"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  onSubmit={handleSignUp}
                  className="space-y-5"
                >
                  <motion.div variants={fadeInUp}>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-600">Join Swift Grocers today</p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.firstName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-green-500 transition-colors`} />
                      </div>
                      {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.lastName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-green-500 transition-colors`} />
                      </div>
                      {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                    </motion.div>
                  </div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-green-500 transition-colors`} />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234 803 123 4567" className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-green-500 transition-colors`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.password}</p>}

                    {/* Password Strength Meter */}
                    {passwordStrength && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <span>Password strength</span>
                          <span className="font-medium">{strengthInfo.label}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className={`h-2 ${strengthInfo.color}`} style={{ width: `${(passwordStrength.score / passwordStrength.max) * 100}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Use at least 8 characters including upper & lower case letters, numbers, and symbols.
                        </p>
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-green-500 transition-colors`} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.confirmPassword}</p>}
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address (Optional)</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Example Street, Lagos" className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
                    </div>
                  </motion.div>

                  <motion.button variants={fadeInUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Creating account...</>) : (<>Create Account<ArrowRight className="w-5 h-5" /></>)}
                  </motion.button>

                  <motion.div variants={fadeInUp} className="text-center text-sm text-gray-500">
                    By creating an account you agree to our <a className="text-green-600 font-semibold" href="/terms">Terms of Service</a> and <a className="text-green-600 font-semibold" href="/privacy">Privacy Policy</a>.
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
