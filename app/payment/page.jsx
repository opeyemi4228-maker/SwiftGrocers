'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

// Map lucide exports and provide a small fallback for Bank if it's not available
const {
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
  User,
  Phone,
  DollarSign,
  Copy,
  Globe
} = Icons;

const Bank = Icons.Bank || function BankFallback(props) {
  // simple fallback bank icon (keeps styling same as lucide-react components)
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 4l9 6.5" />
      <path d="M5 10.5v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" />
      <path d="M10 14v3" />
      <path d="M14 14v3" />
    </svg>
  );
};

import { clearCart, getTotal } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PaymentPage() {
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('card');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cartTotal = getTotal();
    setTotal(cartTotal);
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    if (selectedPayment === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Format: MM/YY';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      else if (formData.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) =>
    value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 3) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    setFormData((prev) => ({ ...prev, expiryDate: value }));
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setFormData((prev) => ({ ...prev, cvv: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate processing

      if (selectedPayment === 'paypal') {
        showNotification('success', 'Redirecting to PayPal...');
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else if (selectedPayment === 'bank') {
        showNotification('success', 'Bank transfer instructions confirmed.');
      }

      setPaymentSuccess(true);
      clearCart();
      setTimeout(() => router.push('/'), 3000);
    } catch (err) {
      showNotification('error', err?.message || 'Payment failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCart = () => router.push('/cart');

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('success', 'Copied to clipboard!');
    } catch {
      showNotification('error', 'Unable to copy to clipboard');
    }
  };

  if (paymentSuccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4 font-[Montserrat]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">Your order has been confirmed. Redirecting...</p>
            <motion.div className="bg-green-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between font-semibold text-gray-900 mb-1">
                <span>Amount Paid:</span>
                <span className="text-green-600">₦{total.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600">
                Confirmation sent to <strong>{formData.email}</strong>
              </div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all"
            >
              Back to Home
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-[Montserrat]">
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[9999] max-w-md w-full px-4"
          >
            <div
              className={`rounded-xl shadow-2xl p-4 flex items-center gap-3 ${
                notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              } text-white`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
              <span className="font-semibold">{notification.message}</span>
            </div>
          </motion.div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-12">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={handleBackToCart}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-8 transition-all"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Cart
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handlePayment}
                className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
              >
                {/* Personal Info */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-12 px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Payment Options */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
                      { id: 'paypal', label: 'PayPal', icon: <Globe className="w-5 h-5" /> },
                      { id: 'bank', label: 'Bank Transfer', icon: <Bank className="w-5 h-5" /> },
                      { id: 'cod', label: 'Cash on Delivery', icon: <DollarSign className="w-5 h-5" /> }
                    ].map((option) => (
                      <div key={option.id}>
                        <label
                          className={`flex items-center gap-3 cursor-pointer p-3 border rounded-xl ${
                            selectedPayment === option.id ? 'border-green-600 bg-green-50' : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentOption"
                            value={option.id}
                            checked={selectedPayment === option.id}
                            onChange={() => setSelectedPayment(option.id)}
                            className="accent-green-600"
                          />
                          {option.icon}
                          <span className="font-semibold">{option.label}</span>
                        </label>

                        <AnimatePresence>
                          {selectedPayment === option.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pl-10 mt-2 space-y-2"
                            >
                              {option.id === 'card' && (
                                <>
                                  <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                      type={showCardNumber ? 'text' : 'password'}
                                      name="cardNumber"
                                      value={formData.cardNumber}
                                      onChange={handleCardNumberChange}
                                      placeholder="Card Number"
                                      className="w-full pl-12 px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-green-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowCardNumber((s) => !s)}
                                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                      {showCardNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <input
                                      type="text"
                                      name="expiryDate"
                                      value={formData.expiryDate}
                                      onChange={handleExpiryChange}
                                      placeholder="MM/YY"
                                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-green-500"
                                    />
                                    <input
                                      type="password"
                                      name="cvv"
                                      value={formData.cvv}
                                      onChange={handleCVVChange}
                                      placeholder="CVV"
                                      className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-green-500"
                                    />
                                  </div>

                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      name="saveCard"
                                      checked={formData.saveCard}
                                      onChange={handleChange}
                                    />
                                    <span className="text-sm">Save card</span>
                                  </label>
                                </>
                              )}

                              {option.id === 'paypal' && (
                                <div className="pt-2">
                                  <p className="text-sm text-gray-600 mb-2">
                                    You will be redirected to PayPal to complete the payment.
                                  </p>
                                </div>
                              )}

                              {option.id === 'bank' && (
                                <div className="bg-gray-50 p-3 rounded-xl space-y-2 text-sm">
                                  <p>Bank: Zenith Bank</p>
                                  <p>Account: 1234567890</p>
                                  <p>Amount: ₦{total.toLocaleString()}</p>
                                  <p>Reference: ORD12345</p>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard('1234567890')}
                                    className="flex items-center gap-1 text-green-600"
                                  >
                                    Copy Account <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              )}

                              {option.id === 'cod' && <p className="text-gray-600 text-sm">Pay cash on delivery.</p>}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Pay ₦{total.toLocaleString()}</>}
                </motion.button>
              </motion.form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 sticky top-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="bg-green-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Order Total:</span>
                    <motion.span
                      key={total}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl font-bold text-green-600"
                    >
                      ₦{total.toLocaleString()}
                    </motion.span>
                  </div>
                  <p className="text-xs text-gray-500">Includes all taxes and fees</p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Secure Payment
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> 24/7 Support
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Fast Checkout
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
