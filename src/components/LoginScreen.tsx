import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LoginScreen = () => {
  const { setPhone, setStep, setUser } = useAppStore();
  const [phoneInput, setPhoneInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setPhone(session.user.phone?.replace('+91', '') || '');
        setStep('location');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setPhone(session.user.phone?.replace('+91', '') || '');
        setStep('location');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    const cleaned = phoneInput.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOtp({
      phone: `+91${cleaned}`,
    });
    setLoading(false);

    if (authError) {
      toast.error(authError.message);
      return;
    }
    setPhone(cleaned);
    setStep('otp');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--gradient-surface)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-glow mb-4"
          >
            <Zap className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">EV Rescue</h1>
          <p className="text-muted-foreground mt-2">Emergency Battery Delivery</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your mobile number to get started</p>

          <div className="flex gap-2 mb-2">
            <div className="flex items-center px-3 bg-muted rounded-lg text-sm font-medium text-muted-foreground">
              +91
            </div>
            <Input
              type="tel"
              placeholder="Enter mobile number"
              value={phoneInput}
              onChange={(e) => { setPhoneInput(e.target.value); setError(''); }}
              maxLength={10}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          {error && <p className="text-destructive text-xs mb-3">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full gradient-primary text-primary-foreground mt-4 h-12 text-base font-semibold shadow-glow"
          >
            {loading ? 'Sending OTP...' : 'Get OTP'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          {[
            { icon: Clock, label: '15 min delivery' },
            { icon: Shield, label: 'Safe & verified' },
            { icon: Zap, label: 'All EV brands' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{f.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
