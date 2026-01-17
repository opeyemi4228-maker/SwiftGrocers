'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Truck, CheckCircle, XCircle, Clock, Search, Filter,
  ChevronDown, ChevronRight, Eye, Download, RotateCcw, MessageCircle,
  Calendar, MapPin, CreditCard, Star, AlertCircle, RefreshCw,
  ShoppingBag, PhoneCall, Mail, X
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

// Order Manager
class OrderManager {
  static ORDERS_KEY = 'swift_grocers_orders';

  static getOrders() {
    if (typeof window === 'undefined') return [];
    const orders = localStorage.getItem(this.ORDERS_KEY);
    return orders ? JSON.parse(orders) : this.getSampleOrders();
  }

  static saveOrders(orders) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }

  static getSampleOrders() {
    return [
      {
        id: 'ORD-2024-001234',
        date: '2024-11-10T14:30:00',
        status: 'delivered',
        total: 15750,
        items: [
          { name: 'Fresh Organic Tomatoes', quantity: 3, price: 850, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300' },
          { name: 'Premium Rice (5kg)', quantity: 2, price: 3500, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300' }
        ],
        deliveryAddress: '123 Main Street, Victoria Island, Lagos',
        paymentMethod: 'Card ending in 4242',
        deliveryDate: '2024-11-12',
        canReturn: true,
        tracking: 'TRK-891234567'
      },
      {
        id: 'ORD-2024-001235',
        date: '2024-11-12T09:15:00',
        status: 'in_transit',
        total: 8900,
        items: [
          { name: 'Fresh Milk (1L)', quantity: 4, price: 1200, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300' },
          { name: 'Whole Wheat Bread', quantity: 2, price: 650, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300' }
        ],
        deliveryAddress: '456 Park Avenue, Lekki Phase 1, Lagos',
        paymentMethod: 'Card ending in 8888',
        estimatedDelivery: '2024-11-14',
        canReturn: false,
        tracking: 'TRK-891234568'
      },
      {
        id: 'ORD-2024-001236',
        date: '2024-11-13T16:45:00',
        status: 'processing',
        total: 12300,
        items: [
          { name: 'Organic Chicken (1kg)', quantity: 2, price: 4500, image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300' },
          { name: 'Fresh Vegetables Bundle', quantity: 1, price: 3300, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' }
        ],
        deliveryAddress: '789 Queens Drive, Ikeja GRA, Lagos',
        paymentMethod: 'Cash on Delivery',
        estimatedDelivery: '2024-11-15',
        canReturn: false,
        tracking: 'TRK-891234569'
      },
      {
        id: 'ORD-2024-001237',
        date: '2024-10-28T11:20:00',
        status: 'returned',
        total: 6800,
        items: [
          { name: 'Breakfast Cereal Box', quantity: 2, price: 2400, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300' }
        ],
        deliveryAddress: '321 Riverside, Ikoyi, Lagos',
        paymentMethod: 'Card ending in 5555',
        returnDate: '2024-11-01',
        returnReason: 'Product damaged',
        refundAmount: 6800,
        refundStatus: 'processed',
        tracking: 'TRK-891234570'
      }
    ];
  }

  static initiateReturn(orderId, reason, items) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.returnRequested = true;
      order.returnReason = reason;
      order.returnDate = new Date().toISOString();
      order.returnItems = items;
      order.refundAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      order.refundStatus = 'pending';
      this.saveOrders(orders);
    }
    return orders;
  }
}

const statusConfig = {
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Clock },
  in_transit: { label: 'In Transit', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
  returned: { label: 'Returned', color: 'bg-orange-100 text-orange-700', icon: RotateCcw }
};

// Mapping refundStatus to timeline index
const refundStatusIndex = {
  pending: 0,
  processed: 1,
  refunded: 2
};

export default function ReturnsOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnItems, setReturnItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    setOrders(OrderManager.getOrders());
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTab = activeTab === 'orders' ? true : (order.status === 'returned' || order.returnRequested);
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleReturnRequest = () => {
    if (!returnReason || returnItems.length === 0) {
      showNotification('error', 'Please select items and a reason for return');
      return;
    }

    OrderManager.initiateReturn(selectedOrder.id, returnReason, returnItems);
    setOrders(OrderManager.getOrders());
    setShowReturnModal(false);
    setSelectedOrder(null);
    setReturnReason('');
    setReturnItems([]);
    showNotification('success', 'Return request submitted successfully!');
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 font-[Montserrat]">
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
              {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              <span className="font-semibold">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">Orders & Returns</h1>
            </div>
            <p className="text-green-100 text-lg">
              Track your orders, view order history, and manage returns
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 border-b-2 font-semibold transition-all ${activeTab === 'orders' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                My Orders
              </div>
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`py-4 border-b-2 font-semibold transition-all ${activeTab === 'returns' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Returns & Refunds
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filter */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-12 text-center"
            >
              <Package className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {activeTab === 'returns' ? "You haven't made any returns yet" : "Start shopping to see your orders here"}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const config = statusConfig[order.status];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${config.color}`}>
                              <Icon className="w-4 h-4" />
                              {config.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-4 h-4" />
                              {order.paymentMethod}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            ₦{order.total.toLocaleString()}
                          </div>
                          {order.estimatedDelivery && (
                            <p className="text-sm text-gray-600">
                              Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Delivery Address</p>
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      </div>
                    </div>

                    {/* Return Info */}
                    {order.returnRequested && (
                      <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <RefreshCw className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <p className="font-semibold text-orange-900">Return Requested</p>
                        </div>

                        {/* Timeline Tracker */}
                        <div className="mt-2 flex items-center justify-between">
                          {['Pending', 'Processed', 'Refunded'].map((stage, idx) => {
                            const currentIdx = refundStatusIndex[order.refundStatus] ?? 0;
                            const isCompleted = idx < currentIdx;
                            const isActive = idx === currentIdx;

                            return (
                              <div key={stage} className="flex-1 flex flex-col items-center relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                  isCompleted ? 'bg-green-600' : isActive ? 'bg-orange-600' : 'bg-gray-300'
                                }`}>
                                  {idx + 1}
                                </div>
                                <p className={`mt-2 text-sm ${isCompleted ? 'text-green-600' : isActive ? 'text-orange-600' : 'text-gray-400'}`}>
                                  {stage}
                                </p>
                                {idx < 2 && (
                                  <div className={`absolute top-3 left-1/2 w-full h-1 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} style={{ zIndex: -1 }}></div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <p className="text-sm text-gray-700 mt-2">Reason: {order.returnReason}</p>
                        <p className="text-sm text-gray-700">Refund Amount: ₦{order.refundAmount.toLocaleString()}</p>
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
