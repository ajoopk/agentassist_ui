/** Figma: Rewamp / 01_Login and 01_OTP */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../data/api';
import { Button, Input, cn } from '../components/ui';

function BrandPanel() {
  return (
    <div className="relative hidden w-[879px] shrink-0 overflow-hidden bg-[#152A6E] lg:block">
      <div className="absolute inset-0 opacity-90"
        style={{ background: 'radial-gradient(120% 90% at 20% 30%, #2447B5 0%, #152A6E 45%, #0C1738 100%)' }} />
      <div className="absolute inset-0 opacity-[0.18]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 3px)' }} />
      <div className="relative flex h-full items-center justify-center gap-5">
        <span className="grid h-[81px] w-[81px] place-items-center rounded-full bg-[#00A9E0] text-sm font-semibold text-white">avaamo</span>
        <span className="text-[44px] font-medium text-white">Agent Assist</span>
      </div>
    </div>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-[360px]">{children}</div>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = /\S+@\S+\.\S+/.test(email);

  return (
    <AuthShell>
      <h1 className="text-2xl font-semibold text-ink">Log in to continue</h1>
      <form
        className="mt-5 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault(); if (!valid) return;
          setBusy(true); await api.requestLoginCode(email); navigate('/otp', { state: { email } });
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Work email</span>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@deaconess.com" autoFocus />
        </label>
        <Button type="submit" variant="primary" className="h-11 w-full" disabled={!valid || busy}>
          {busy ? 'Sending…' : 'Send code'}
        </Button>
        <p className="text-[13px] text-muted">We’ll email you a 6-digit code. It expires in 10 minutes.</p>
      </form>
    </AuthShell>
  );
}

export function Otp() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['4', '8', '1', '', '', '']);
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(42);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const code = digits.join('');
  const complete = code.length === 6 && digits.every(Boolean);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [seconds]);

  function setAt(i: number, v: string) {
    const d = v.replace(/\D/g, '').slice(-1);
    setDigits((prev) => { const next = [...prev]; next[i] = d; return next; });
    setError(false);
    if (d && i < 5) refs.current[i + 1]?.focus();
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-semibold text-ink">Log in to continue</h1>
      <p className="mt-1.5 text-sm text-muted">We sent a code to vignesh@eaglehealth.com</p>
      <form
        className="mt-5 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await api.verifyLoginCode(code);
          if (res.ok) navigate('/calls'); else setError(true);
        }}
      >
        <div>
          <span className="mb-2 block text-sm font-medium text-ink">Verification code</span>
          <div className="flex gap-2">
            {digits.map((d, i) => (
              <input
                key={i} ref={(el) => (refs.current[i] = el)} value={d} inputMode="numeric" maxLength={1}
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => setAt(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus(); }}
                className={cn(
                  'h-12 w-12 rounded border bg-white text-center text-lg font-medium text-ink',
                  'focus:outline-none focus:ring-2 focus:ring-ink',
                  error ? 'border-destructive' : 'border-line',
                )}
              />
            ))}
          </div>
          {error && <p className="mt-2 text-[13px] text-destructive">That code isn’t right. Check the email and try again.</p>}
        </div>
        <Button type="submit" variant={complete ? 'primary' : 'outline'} className="h-11 w-full" disabled={!complete}>Verify</Button>
        <p className="flex items-center gap-1.5 text-[13px] text-muted">
          Didn’t get it?
          {seconds > 0
            ? <span className="font-medium text-ink">Resend in 0:{String(seconds).padStart(2, '0')}</span>
            : <button type="button" onClick={() => setSeconds(42)} className="font-medium text-ink underline underline-offset-2">Resend code</button>}
        </p>
      </form>
    </AuthShell>
  );
}
