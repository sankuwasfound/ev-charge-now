import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';

const OtpScreen = () => {
  const { phone, setStep } = useAppStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.every((d) => d !== '')) {
      setStep('location');
    }
  };

  const filled = otp.every((d) => d !== '');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--gradient-surface)' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <button onClick={() => setStep('login')} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">Verify OTP</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sent to <span className="font-medium text-foreground">+91 {phone}</span>
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-ring/20 outline-none transition-all"
              />
            ))}
          </div>

          <Button onClick={handleVerify} disabled={!filled} className="w-full gradient-primary text-primary-foreground h-12 text-base font-semibold shadow-glow disabled:opacity-50">
            Verify & Continue
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {timer > 0 ? (
              <>Resend OTP in <span className="text-primary font-medium">{timer}s</span></>
            ) : (
              <button onClick={() => setTimer(30)} className="text-primary font-medium hover:underline">Resend OTP</button>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpScreen;
