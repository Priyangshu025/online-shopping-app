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
      <div className="p-5 bg-rose-50 border border-danger/20 rounded-card flex items-center gap-3 text-ink">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-danger" />
        <div>
          <h4 className="text-sm font-semibold text-danger">Order Cancelled</h4>
          <p className="text-xs text-ink-muted mt-0.5">This order was cancelled and any stock has been restored.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex(s => s.key === currentStatus);
  const activeStep = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="py-6 px-6 bg-surface-alt rounded-card border border-line/60">
      <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-6">Delivery Tracking</h3>

      <div className="relative">
        {/* Connecting line */}
        <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-line z-0">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-2 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;
            const historyEvent = timeline.find(t => t.status === step.key);

            return (
              <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center flex-1">
                
                {/* Node icon circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-accent text-white'
                      : isCurrent
                      ? 'bg-accent text-white ring-4 ring-accent/20'
                      : 'bg-white border border-line text-ink-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                </div>

                {/* Text details */}
                <div className="text-left sm:text-center">
                  <p className={`text-xs font-medium ${isCurrent ? 'text-accent font-semibold' : isCompleted ? 'text-ink' : 'text-ink-muted'}`}>
                    {step.label}
                  </p>
                  {historyEvent && (
                    <p className="text-[11px] text-ink-muted">
                      {new Date(historyEvent.timestamp).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
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
