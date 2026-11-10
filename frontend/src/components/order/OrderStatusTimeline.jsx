import React from 'react';
import { Check, Clock, Package, Truck, Home, AlertCircle } from 'lucide-react';

const OrderStatusTimeline = ({ currentStatus, timeline = [] }) => {
  const steps = [
    { key: 'Order Placed', label: 'Order Placed', icon: Clock },
    { key: 'Processing', label: 'Processing', icon: Package },
    { key: 'Shipped', label: 'Shipped', icon: Truck },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: Home },
  ];

  if (currentStatus === 'Cancelled') {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
        <div>
          <h4 className="text-sm font-bold">This Order was Cancelled</h4>
          <p className="text-xs text-rose-600">The order was cancelled and inventory was returned to the catalog.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex(s => s.key === currentStatus);
  const activeStep = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="py-6 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">Delivery Tracking</h4>

      <div className="relative">
        {/* Connecting line */}
        <div className="hidden sm:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-100 z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-700"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-2 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;

            // Find matching event in timeline history
            const historyEvent = timeline.find(t => t.status === step.key);

            return (
              <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center flex-1">
                
                {/* Node icon circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-lg'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                </div>

                {/* Text details */}
                <div className="text-left sm:text-center">
                  <p className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {step.label}
                  </p>
                  {historyEvent && (
                    <p className="text-[10px] text-slate-400">
                      {new Date(historyEvent.timestamp).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTimeline;

