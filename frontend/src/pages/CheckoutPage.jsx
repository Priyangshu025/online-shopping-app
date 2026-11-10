import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Truck, 
  Lock, 
  ArrowLeft,
  CheckCircle,
  Building,
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue checkout');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Prepopulate user address if available
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
      // Step 1: If online payment via Razorpay, initiate payment
      let paymentDetails = null;

      if (paymentMethod === 'Razorpay' || paymentMethod === 'Card' || paymentMethod === 'UPI') {
        const payRes = await api.post('/payments/create', {
          amount: totals.finalTotal,
          currency: 'INR',
        });

        // Simulate gateway verification
        if (payRes.success) {
          const verifyRes = await api.post('/payments/verify', {
            razorpay_order_id: payRes.orderId,
            razorpay_payment_id: 'pay_' + Math.random().toString(36).substring(2, 10),
            razorpay_signature: 'sig_' + Math.random().toString(36).substring(2, 10),
          });
          paymentDetails = {
            gateway: 'Razorpay',
            gatewayOrderId: payRes.orderId,
            transactionId: verifyRes.paymentId,
          };
        }
      }

      // Step 2: Create Order in database
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
        toast.success('🎉 Order placed successfully!');
        clearCart();
        navigate(`/orders/${res.data._id}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link to="/cart" className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-xs text-slate-500">Complete your delivery and payment details</p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Columns: Address + Payment Options */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Shipping Address */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">1. Delivery Address</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name / Recipient</label>
                  <input
                    type="text"
                    name="recipient"
                    value={shippingAddress.recipient}
                    onChange={handleInputChange}
                    placeholder="Recipient's Name"
                    required
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Flat / House No., Building, Street</label>
                  <input
                    type="text"
                    name="addressLines"
                    value={shippingAddress.addressLines}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 301, Palm Grove Apts, 12th Main Road"
                    required
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Postal PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    placeholder="6 digits PIN"
                    required
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm">2. Choose Payment Mode</h3>
              </div>

              <div className="space-y-3">
                
                {/* Razorpay Online */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Razorpay'
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="mt-1 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">Razorpay Smart Gateway (Cards, UPI, NetBanking)</p>
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">Fast & Secure</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Support for all Indian credit/debit cards, Google Pay, PhonePe, Paytm, and net banking with instant confirmation.
                    </p>
                  </div>
                </label>

                {/* UPI Direct */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">UPI (Google Pay / PhonePe / Paytm)</p>
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Instant zero-fee transfer using any registered UPI application.</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                      <Building className="w-4 h-4 text-slate-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Pay with cash or UPI QR scan upon doorstep delivery.</p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right Column: Order Review & Confirmation CTA */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-sm pb-3 border-b border-slate-100">
                Order Review ({items.length} items)
              </h3>

              {/* Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image || ''}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-800">
                      ₹{((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon ({coupon?.code})</span>
                    <span>- ₹{totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-slate-800">
                    {totals.deliveryCharge === 0 ? 'FREE' : `₹${totals.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Taxes (10%)</span>
                  <span className="font-semibold text-slate-800">₹{totals.tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-900 font-black text-base pt-3 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{totals.finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Lock className="w-4 h-4" />
                <span>{processing ? 'Processing Payment...' : `Pay ₹${totals.finalTotal.toLocaleString('en-IN')}`}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL Secured & Verified Order</span>
              </div>

            </div>

          </div>

        </div>
      </form>

    </div>
  );
};

export default CheckoutPage;

