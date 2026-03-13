import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Car, Plane, Clock, IndianRupee, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, DELIVERY_COSTS } from '@/store/appStore';
import type { DeliveryMethod } from '@/store/appStore';

const methods: { id: DeliveryMethod; name: string; desc: string; icon: typeof Building2; eta: string; tag?: string }[] = [
  { id: 'station', name: 'Direct Station', desc: 'Pick up from nearest station. Cheapest option.', icon: Building2, eta: '30–45 min', tag: 'Cheapest' },
  { id: 'carpool', name: 'Car Pooling', desc: 'Request sent to drivers within 10–17 km radius.', icon: Car, eta: '20–30 min', tag: 'Popular' },
  { id: 'drone', name: 'Drone Delivery', desc: 'Fastest delivery via aerial drone.', icon: Plane, eta: '10–15 min', tag: 'Fastest' },
];

const DeliveryScreen = () => {
  const { battery, setDeliveryMethod, setTotalCost, setStep } = useAppStore();
  const [selected, setSelected] = useState<DeliveryMethod | null>(null);

  const handleContinue = () => {
    if (selected && battery) {
      setDeliveryMethod(selected);
      setTotalCost(battery.price + DELIVERY_COSTS[selected]);
      setStep('payment');
    }
  };

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'var(--gradient-surface)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
        <button onClick={() => setStep('battery')} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-1">Delivery Method</h1>
        <p className="text-sm text-muted-foreground mb-6">Choose how you want to receive your battery</p>

        <div className="space-y-3">
          {methods.map((m, i) => {
            const cost = DELIVERY_COSTS[m.id];
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(m.id)}
                className={`w-full glass-card p-4 text-left transition-all ${
                  selected === m.id ? 'ring-2 ring-primary shadow-glow' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    selected === m.id ? 'gradient-primary' : 'bg-accent'
                  }`}>
                    <m.icon className={`w-5 h-5 ${selected === m.id ? 'text-primary-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm">{m.name}</h3>
                      {m.tag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{m.tag}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {m.eta}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                        <IndianRupee className="w-3 h-3" /> {cost === 0 ? 'Free' : `+₹${cost}`}
                      </span>
                      {m.id === 'carpool' && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" /> 10–17 km
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Cost Summary */}
        {selected && battery && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mt-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Battery ({battery.name})</span>
              <span>₹{battery.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>Delivery</span>
              <span>{DELIVERY_COSTS[selected] === 0 ? 'Free' : `₹${DELIVERY_COSTS[selected]}`}</span>
            </div>
            <div className="border-t border-border mt-2 pt-2 flex justify-between text-base font-bold text-foreground">
              <span>Total</span>
              <span>₹{(battery.price + DELIVERY_COSTS[selected]).toLocaleString()}</span>
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full gradient-primary text-primary-foreground h-12 text-base font-semibold shadow-glow mt-6 disabled:opacity-50"
        >
          Proceed to Payment
        </Button>
      </motion.div>
    </div>
  );
};

export default DeliveryScreen;
