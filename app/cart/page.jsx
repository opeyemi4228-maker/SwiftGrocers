'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Trash2, Plus, Minus, Heart, Tag, Truck,
  Clock, AlertCircle, ArrowRight, Gift, Sparkles, CreditCard,
  ChevronRight, X, Check, Package, Shield
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { getCart, addItem, updateQuantity as updateQtyShared, removeItem as removeItemShared, clearCart as clearCartShared } from '@/lib/cart';
import { useRouter } from 'next/navigation';

// Sample products for demo
const sampleProducts = [
  { id: 'prod-1', name: 'Fresh Organic Tomatoes', price: 850, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', category: 'Fresh Produce' },
  { id: 'prod-2', name: 'Premium Rice (5kg)', price: 3500, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', category: 'Grains' },
  { id: 'prod-3', name: 'Fresh Milk (1L)', price: 1200, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', category: 'Dairy' }
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    setCartItems(getCart());

    const handleCartUpdate = () => setCartItems(getCart());
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    updateQtyShared(productId, newQuantity);
    setCartItems(getCart());
  };

  const removeItem = (productId) => {
    removeItemShared(productId);
    setCartItems(getCart());
    showNotification('success', 'Item removed from cart');
  };

  const saveForLater = (item) => {
    setSavedItems([...savedItems, item]);
    removeItem(item.id);
    showNotification('success', 'Item saved for later');
  };

  const moveToCart = (item) => {
    addItem(item, item.quantity);
    setSavedItems(savedItems.filter(i => i.id !== item.id));
    setCartItems(getCart());
    showNotification('success', 'Item moved to cart');
  };

  const applyPromoCode = () => {
    const validCodes = { SAVE10: 10, WELCOME20: 20, FREESHIP: 0 };
    const code = promoCode.toUpperCase();
    if (validCodes[code] !== undefined) {
      setDiscount(validCodes[code]);
      showNotification('success', `Promo code applied! ${validCodes[code]}% discount`);
    } else {
      showNotification('error', 'Invalid promo code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const deliveryFee = subtotal > 5000 ? 0 : 500;
  const total = subtotal - discountAmount + deliveryFee;

  const addSampleProduct = (product) => {
    addItem(product, 1);
    setCartItems(getCart());
    showNotification('success', 'Item added to cart!');
    const btn = document.getElementById(`add-btn-${product.id}`);
    if (btn) {
      btn.classList.add('animate-bounce');
      setTimeout(() => btn.classList.remove('animate-bounce'), 300);
    }
  };

  // Navigate to payment page
  const handleGoToPayment = () => {
    router.push('/payment');
  };

  // Called when user clicks "Proceed to Checkout" button
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    // Just show the modal — payment popup opens only when "Continue to Payment" is clicked
    setShowCheckout(true);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-[Montserrat]">

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[9999] max-w-md"
          >
            <div className={`rounded-xl shadow-2xl p-4 flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
              {notification.type === 'success' ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              <span className="font-semibold">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Cart Badge */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 px-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Swift Grocers</h1>
        <div className="relative flex items-center gap-2 cursor-pointer">
          <ShoppingCart className="w-8 h-8" />
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.div
                key={cartItems.length}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
              >
                {cartItems.length}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Demo Product Adder */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Demo: Add Sample Products</h3>
              <div className="flex flex-wrap gap-2">
                {sampleProducts.map(product => (
                  <button
                    key={product.id}
                    id={`add-btn-${product.id}`}
                    onClick={() => addSampleProduct(product)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full transition-all"
                  >
                    Add {product.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to get started!</p>
                <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all">
                  Continue Shopping <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex gap-6">
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-all">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all"><Minus className="w-4 h-4" /></button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-all"><Plus className="w-4 h-4" /></button>
                            </div>
                            <div className="text-right">
                              <motion.div key={item.price * item.quantity} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-2xl font-bold text-green-600">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </motion.div>
                              <div className="text-sm text-gray-500">₦{item.price.toLocaleString()} each</div>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <button onClick={() => saveForLater(item)} className="text-sm text-gray-600 hover:text-green-600 flex items-center gap-1 transition-all">
                              <Heart className="w-4 h-4" /> Save for later
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Saved for Later */}
            {savedItems.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Saved for Later</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedItems.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                          <p className="text-green-600 font-bold mb-2">₦{item.price.toLocaleString()}</p>
                          <button onClick={() => moveToCart(item)} className="text-sm text-green-600 hover:text-green-700 font-semibold">Move to cart</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter code" className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <button onClick={applyPromoCode} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all">Apply</button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Try: SAVE10, WELCOME20</p>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><motion.span key={subtotal} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>₦{subtotal.toLocaleString()}</motion.span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({discount}%)</span><motion.span key={discountAmount} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>-₦{discountAmount.toLocaleString()}</motion.span></div>}
                <div className="flex justify-between text-gray-600"><span>Delivery</span>{deliveryFee === 0 ? 'FREE' : `₦${deliveryFee}`}</div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <motion.span key={total} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>₦{total.toLocaleString()}</motion.span>
              </div>

              <button onClick={() => handleProceedToCheckout()} disabled={cartItems.length === 0} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                <CreditCard className="w-5 h-5" /> Proceed to Checkout
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600"><Shield className="w-5 h-5 text-green-600" /><span>Secure checkout</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><Truck className="w-5 h-5 text-green-600" /><span>Free delivery over ₦5,000</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><Clock className="w-5 h-5 text-green-600" /><span>Same-day delivery available</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={() => setShowCheckout(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="mb-4"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Checkout</h3>
                  <p className="text-gray-600 mb-6">Review your order and proceed to payment.</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-50 rounded-xl p-4 mb-6 text-left"
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Order Total:</span>
                      <span className="text-green-600">₦{total.toLocaleString()}</span>
                    </div>
                    <div className="text-gray-600">Items: {cartItems.length}</div>
                  </div>
                </motion.div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGoToPayment()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" /> Continue to Payment
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCheckout(false)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all"
                  >
                    Back to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
    <Footer />
    </>
  );
}
