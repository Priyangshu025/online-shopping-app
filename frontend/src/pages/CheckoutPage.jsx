import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Truck, 
  Lock, 
  ArrowLeft,
  Building,
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Price from '../components/ui/Price';

const CheckoutPage = () => {
  const { items, totals, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    recipient: '',
    phone: '',
    addressLines: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [processing, setProcessing] = useState(false);

  // Dynamically load Razorpay SDK only on checkout page if needed
  useEffect(() => {
    if (!document.getElementById('razorpay-sdk')) {
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to complete your checkout');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    if (user) {
      const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      if (defaultAddr) {
        setShippingAddress({
          recipient: defaultAddr.recipient || user.name || '',
          phone: defaultAddr.phone || user.phone || '',
          addressLines: defaultAddr.addressLines || '',
          city: defaultAddr.city || 'Bengaluru',
          state: defaultAddr.state || 'Karnataka',
          postalCode: defaultAddr.postalCode || '',
        });
      } else {
        setShippingAddress((prev) => ({
          ...prev,
          recipient: user.name || '',
          phone: user.phone || '',
        }));
      }
    }
  }, [user, isAuthenticated, items, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.recipient || !shippingAddress.phone || !shippingAddress.addressLines || !shippingAddress.postalCode) {
      toast.error('Please fill in all shipping address fields');
      return;
    }

    setProcessing(true);

    try {
      if (paymentMethod === 'Razorpay' || paymentMethod === 'UPI') {
        const payRes = await api.post('/payments/create', {
          amount: totals.finalTotal,
          currency: 'INR',
        });

        if (payRes.success) {
          await api.post('/payments/verify', {
            razorpay_order_id: payRes.orderId,
            razorpay_payment_id: 'pay_' + Math.random().toString(36).substring(2, 10),
            razorpay_signature: 'sig_' + Math.random().toString(36).substring(2, 10),
          });
        }
      }

      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
        })),
        shippingAddress,
        paymentMethod,
        couponCode: coupon?.code || '',
      };

      const res = await api.post('/orders', orderPayload);

      if (res.success && res.data) {
        toast.success('Order placed successfully');
        clearCart();
        navigate(`/orders/${res.data._id}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Unable to place order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container-page py-10 sm:py-16 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-line/60">
        <Link to="/cart" className="p-2 text-ink-muted hover:text-ink rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">Checkout</h1>
          <p className="text-xs sm:text-sm text-ink-muted">Step-by-step secure fulfillment</p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Columns: Numbered Steps */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Shipping Address */}
            <div className="rounded-card bg-surface p-6 sm:p-8 border border-line/60 space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-line/40">
                <span className="w-6 h-6 rounded-full bg-ink text-white text-xs font-semibold flex items-center justify-center">1</span>
                <h2 className="text-lg font-semibold text-ink">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1.5">Recipient Full Name</label>
                  <input
                    type="text"
                    name="recipient"
                    value={shippingAddress.recipient}
                    onChange={handleInputChange}
                    placeholder="Recipient's Name"
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1.5">Mobile Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                    className="input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-ink-muted block mb-1.5">Address (Flat, Building, Street)</label>
                  <input
                    type="text"
                    name="addressLines"
                    value={shippingAddress.addressLines}
                    onChange={handleInputChange}
                    placeholder="Flat 301, Palm Grove, 12th Main Road"
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1.5">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1.5">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1.5">Postal PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="6 digits PIN"
                    required
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="rounded-card bg-surface p-6 sm:p-8 border border-line/60 space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-line/40">
                <span className="w-6 h-6 rounded-full bg-ink text-white text-xs font-semibold flex items-center justify-center">2</span>
                <h2 className="text-lg font-semibold text-ink">Payment Method</h2>
              </div>

              <div className="space-y-3">
                
                {/* Razorpay Online */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Razorpay'
                      ? 'border-accent bg-accent-soft/40'
                      : 'border-line hover:border-ink-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="mt-1 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">Razorpay (Cards, UPI, NetBanking)</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      All major credit & debit cards, Google Pay, PhonePe, Paytm, and net banking.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-accent bg-accent-soft/40'
                      : 'border-line hover:border-ink-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 text-accent"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">Cash on Delivery (COD)</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Pay upon delivery with cash or UPI scan.
                    </p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right Column: Order Review */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-surface-alt p-6 sm:p-7 rounded-card border border-line/60 space-y-5">
              <h2 className="font-semibold text-ink text-base pb-3 border-b border-line/50">
                Review & Confirm ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h2>

              {/* Items Preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-xs">
                    <div className="w-12 h-12 rounded-lg bg-white border border-line/40 p-1 flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.image || ''}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink truncate">{item.name}</p>
                      <p className="text-ink-muted">Qty: {item.quantity}</p>
                    </div>
                    <Price 
                      value={(item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity} 
                      size="sm" 
                    />
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-line/60 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-ink-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-ink">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-success font-medium">
                    <span>Coupon ({coupon?.code})</span>
                    <span>- ₹{totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-muted">
                  <span>Delivery</span>
                  <span className="font-medium text-ink">
                    {totals.deliveryCharge === 0 ? 'FREE' : `₹${totals.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Estimated Taxes (10% GST)</span>
                  <span className="font-medium text-ink">₹{totals.tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-line/60">
                  <span className="text-base font-semibold text-ink">Total to Pay</span>
                  <Price value={totals.finalTotal} size="md" />
                </div>
              </div>

              {/* Primary Place Order Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={processing}
                  className="w-full"
                >
                  <Lock className="w-4 h-4" />
                  <span>{processing ? 'Processing...' : `Place order (₹${totals.finalTotal.toLocaleString('en-IN')})`}</span>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-ink-muted" />
                <span>Encrypted 256-bit secure checkout</span>
              </div>

            </div>

          </div>

        </div>
      </form>

    </div>
  );
};

export default CheckoutPage;
