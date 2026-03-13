import { useState } from 'react';
import { motion } from 'framer-motion';
import { Battery, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, BATTERIES } from '@/store/appStore';

const BatteryScreen = () => {
  const { setBattery, setStep } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinue = () => {
    const battery = BATTERIES.find((b) => b.id === selectedId);
    if (battery) {
      setBattery(battery);
      setStep('delivery');
    }
  };

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'var(--gradient-surface)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
        <button onClick={() => setStep('location')} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-1">Select Battery</h1>
        <p className="text-sm text-muted-foreground mb-6">Choose the right battery for your EV</p>

        <div className="space-y-3">
          {BATTERIES.map((battery, i) => (
            <motion.button
              key={battery.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedId(battery.id)}
              className={`w-full glass-card p-4 text-left transition-all ${
                selectedId === battery.id ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    selectedId === battery.id ? 'gradient-primary' : 'bg-accent'
                  }`}>
                    <Battery className={`w-5 h-5 ${selectedId === battery.id ? 'text-primary-foreground' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{battery.name}</h3>
                    <p className="text-xs text-muted-foreground">{battery.capacity}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {battery.compatible.map((car) => (
                        <span key={car} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {car}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg font-bold text-foreground">₹{battery.price.toLocaleString()}</span>
                  {selectedId === battery.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedId}
          className="w-full gradient-primary text-primary-foreground h-12 text-base font-semibold shadow-glow mt-6 disabled:opacity-50"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};

export default BatteryScreen;
