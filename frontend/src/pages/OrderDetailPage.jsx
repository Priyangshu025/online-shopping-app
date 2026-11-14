import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import api from '../services/api';
import OrderStatusTimeline from '../components/order/OrderStatusTimeline';
import Price from '../components/ui/Price';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Any payment made will be refunded and inventory restored.')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await api.patch(`/orders/${id}/cancel`);
      if (res.success) {
        toast.success('Order has been cancelled');
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page py-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-page py-24 text-center space-y-4">
        <h2 className="text-xl font-semibold text-ink">Order not found</h2>
        <Link to="/my-orders" className="text-sm font-medium text-accent hover:underline">
          Return to order history
        </Link>
      </div>
    );
  }

  const isCancellable = order.orderStatus === 'Order Placed' || order.orderStatus === 'Processing';

  return (
    <div className="container-page py-10 sm:py-16 space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line/60">
        <div className="flex items-center gap-3">
          <Link to="/my-orders" className="p-2 text-ink-muted hover:text-ink rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
              Order {order.trackingNumber || order._id}
            </h1>
            <p className="text-xs text-ink-muted mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-surface-alt border border-line rounded-full text-xs font-medium text-ink hover:bg-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-ink-muted" />
            <span>Print receipt</span>
          </button>

          {isCancellable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="text-danger border-danger/40 hover:bg-rose-50/50 hover:text-danger"
            >
              {cancelling ? 'Cancelling...' : 'Cancel order'}
            </Button>
          )}
        </div>
      </div>

      {/* Visual Order Status Timeline */}
      <OrderStatusTimeline currentStatus={order.orderStatus} timeline={order.statusTimeline} />

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping Address */}
        <div className="bg-surface-alt p-6 rounded-card border border-line/60 space-y-2 text-xs">
          <h3 className="font-semibold text-ink text-sm">Delivery Address</h3>
          <p className="font-medium text-ink">{order.shippingAddress?.recipient}</p>
          <p className="text-ink-muted">{order.shippingAddress?.addressLines}</p>
          <p className="text-ink-muted">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
          <p className="text-ink-muted pt-1">Phone: {order.shippingAddress?.phone}</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-surface-alt p-6 rounded-card border border-line/60 space-y-2 text-xs">
          <h3 className="font-semibold text-ink text-sm">Payment Details</h3>
          <div className="flex justify-between py-1 border-b border-line/40">
            <span className="text-ink-muted">Method:</span>
            <span className="font-medium text-ink">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-line/40">
            <span className="text-ink-muted">Payment status:</span>
            <span className="font-medium text-ink">{order.paymentStatus}</span>
          </div>
          {order.paymentDetails?.transactionId && (
            <div className="flex justify-between py-1">
              <span className="text-ink-muted">Reference:</span>
              <span className="font-mono text-ink-muted">{order.paymentDetails.transactionId}</span>
            </div>
          )}
        </div>

      </div>

      {/* Items Snapshot Table */}
      <div className="rounded-card border border-line/60 bg-surface overflow-hidden">
        <div className="p-5 border-b border-line/50 flex items-center justify-between">
          <h3 className="font-semibold text-ink text-sm">Items Ordered</h3>
          <span className="text-xs text-ink-muted">{order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="divide-y divide-line/60">
          {order.items?.map((item, idx) => (
            <div key={idx} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-surface-alt border border-line/40 p-1 flex items-center justify-center flex-shrink-0">
                  <img
                    src={item.image || ''}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <Price value={item.price * item.quantity} size="sm" />
              </div>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="p-6 bg-surface-alt border-t border-line/60 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-ink-muted">
            <span>Subtotal</span>
            <span className="font-medium text-ink">₹{order.totals?.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          {order.totals?.discount > 0 && (
            <div className="flex justify-between text-success font-medium">
              <span>Coupon discount</span>
              <span>- ₹{order.totals?.discount?.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-ink-muted">
            <span>Delivery</span>
            <span className="font-medium text-ink">
              {order.totals?.deliveryCharge === 0 ? 'FREE' : `₹${order.totals?.deliveryCharge}`}
            </span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>Estimated taxes (GST)</span>
            <span className="font-medium text-ink">₹{order.totals?.tax?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-baseline pt-4 border-t border-line/60">
            <span className="text-base font-semibold text-ink">Grand total</span>
            <Price value={order.totals?.finalTotal || 0} size="md" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderDetailPage;
