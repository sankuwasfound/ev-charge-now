import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, CreditCard, Landmark, Banknote, AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import type { PaymentMethod } from '@/store/appStore';

const paymentOptions: { id: PaymentMethod; name: string; desc: string; icon: typeof Smartphone }[] = [
  { id: 'upi', name: 'UPI', desc: 'GPay, PhonePe, Paytm', icon: Smartphone },
  { id: 'card', name: 'Debit / Credit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', name: 'Net Banking', desc: 'All major banks', icon: Landmark },
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when delivered', icon: Banknote },
];

const PaymentScreen = () => {
  const { totalCost, setPaymentMethod, setStep } = useAppStore();
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const codRestricted = totalCost > 4000;

  const handlePay = () => {
    if (selected) {
      setPaymentMethod(selected);
      setStep('tracking');
    }
  };

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'var(--gradient-surface)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
        <button onClick={() => setStep('delivery')} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-1">Payment</h1>
        <p className="text-sm text-muted-foreground mb-6">Select your preferred payment method</p>

        {/* Amount */}
        <div className="glass-card p-4 mb-6 text-center">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-3xl font-bold text-foreground mt-1">₹{totalCost.toLocaleString()}</p>
        </div>

        <div className="space-y-3">
          {paymentOptions.map((opt, i) => {
            const disabled = opt.id === 'cod' && codRestricted;
            return (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileTap={disabled ? {} : { scale: 0.98 }}
                onClick={() => !disabled && setSelected(opt.id)}
                disabled={disabled}
                className={`w-full glass-card p-4 text-left transition-all ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ${selected === opt.id ? 'ring-2 ring-primary shadow-glow' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    selected === opt.id ? 'gradient-primary' : 'bg-accent'
                  }`}>
                    <opt.icon className={`w-5 h-5 ${selected === opt.id ? 'text-primary-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">{opt.name}</h3>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  {disabled && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="w-3.5 h-3.5" /> Not available
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {codRestricted && (
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> COD not available for orders above ₹4,000
          </p>
        )}

        <Button
          onClick={handlePay}
          disabled={!selected}
          className="w-full gradient-primary text-primary-foreground h-12 text-base font-semibold shadow-glow mt-6 disabled:opacity-50"
        >
          <Lock className="w-4 h-4 mr-2" /> Pay ₹{totalCost.toLocaleString()}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Secured by 256-bit encryption
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentScreen;
