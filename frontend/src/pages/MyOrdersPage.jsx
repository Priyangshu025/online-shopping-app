import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Price from '../components/ui/Price';
import Badge from '../components/ui/Badge';
import LinkButton from '../components/ui/LinkButton';

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

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'Shipped':
      case 'Out for Delivery':
        return 'accent';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="container-page py-10 sm:py-16 space-y-8">
      
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">Order History</h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">Review receipts and track active deliveries.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-surface-alt rounded-card animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-card bg-surface-alt p-16 text-center space-y-4">
          <Package className="w-8 h-8 text-ink-muted mx-auto" />
          <h2 className="text-lg font-semibold text-ink">No orders placed yet</h2>
          <p className="text-sm text-ink-muted max-w-sm mx-auto">
            Once you complete a purchase, your receipt and delivery tracking will appear here.
          </p>
          <LinkButton to="/products" variant="secondary" size="sm">
            Start shopping
          </LinkButton>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-card bg-surface p-6 border border-line/60 transition hover:shadow-card space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line/40">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {order.trackingNumber || `ORD-${order._id.slice(-6).toUpperCase()}`}
                  </p>
                  <p className="text-xs text-ink-muted">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getBadgeVariant(order.orderStatus)}>
                    {order.orderStatus}
                  </Badge>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-xs font-medium text-accent hover:underline inline-flex items-center gap-1"
                  >
                    <span>View details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3 overflow-x-auto">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-surface-alt border border-line/40 p-1 flex items-center justify-center">
                        <img
                          src={item.image || ''}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="max-w-[160px] hidden md:block">
                        <p className="text-xs font-medium text-ink truncate">{item.name}</p>
                        <p className="text-[11px] text-ink-muted">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right">
                  <p className="text-xs text-ink-muted">Total amount</p>
                  <Price value={order.totals?.finalTotal || 0} size="sm" />
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
