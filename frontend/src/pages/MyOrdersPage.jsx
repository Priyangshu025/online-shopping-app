import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyOrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
        <p className="text-xs text-slate-500 mt-1">Review, track, and manage your recent purchases</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you complete an order, you will be able to track live delivery status and receipts right here.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:border-slate-300 transition-all space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      {order.trackingNumber || `ORD-${order._id.slice(-6).toUpperCase()}`}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 bg-blue-50 rounded-xl"
                  >
                    <span>Track Order</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items Thumbnail preview */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3 overflow-x-auto">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                      <img
                        src={item.image || ''}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100"
                        title={item.name}
                      />
                      <div className="max-w-[150px] hidden md:block">
                        <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Amount</p>
                  <p className="text-base font-black text-slate-900">
                    ₹{order.totals?.finalTotal?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyOrdersPage;

