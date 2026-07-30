"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogoMark } from "@/components/layout/logo";
import { env } from "@/lib/env";
import type { CustomerProfile } from "@/providers/auth-modal-provider";
import { mobileSchema as mobileFieldSchema } from "@/lib/validators";

const mobileSchema = z.object({
  mobile: mobileFieldSchema,
});

type MobileValues = z.infer<typeof mobileSchema>;
type Step = "mobile" | "otp" | "success";

const RESEND_COOLDOWN_SECONDS = 30;

export function OtpLoginModal({
  open,
  onOpenChange,
  onSuccess,
  initialMobile,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (customer: CustomerProfile, accessToken: string, refreshToken: string) => void;
  /** Pre-fills the mobile field when a calling form (e.g. booking widget) already collected it. */
  initialMobile?: string;
}) {
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    reset: resetMobileForm,
    setValue,
    formState: { errors },
  } = useForm<MobileValues>({ resolver: zodResolver(mobileSchema) });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (open && initialMobile && /^\d{10}$/.test(initialMobile)) {
      setValue("mobile", initialMobile);
    }
  }, [open, initialMobile, setValue]);

  function resetAll() {
    setStep("mobile");
    setMobile("");
    setDevOtp(null);
    setOtpDigits(Array(6).fill(""));
    setOtpError(null);
    setSendError(null);
    setCooldown(0);
    resetMobileForm();
  }

  function handleClose(next: boolean) {
    if (!next) resetAll();
    onOpenChange(next);
  }

  async function sendOtp(target: string) {
    setIsSending(true);
    setSendError(null);
    try {
      const res = await axios.post(`${env.NEXT_PUBLIC_API_URL}/customer-auth/send-otp`, { mobile: target });
      setDevOtp(res.data.data.devOtp ?? null);
      setOtpDigits(Array(6).fill(""));
      setOtpError(null);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setStep("otp");
    } catch (err) {
      setSendError(axios.isAxiosError(err) ? err.response?.data?.message ?? "Could not send OTP" : "Could not send OTP");
    } finally {
      setIsSending(false);
    }
  }

  async function onRequestOtp(values: MobileValues) {
    setMobile(values.mobile);
    await sendOtp(values.mobile);
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    setOtpError(null);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function verifyOtp() {
    const entered = otpDigits.join("");
    if (entered.length !== 6) {
      setOtpError("Enter the complete 6-digit OTP");
      return;
    }
    setIsVerifying(true);
    setOtpError(null);
    try {
      const res = await axios.post(`${env.NEXT_PUBLIC_API_URL}/customer-auth/verify-otp`, { mobile, otp: entered });
      const { accessToken, refreshToken, customer } = res.data.data;
      setStep("success");
      onSuccess?.(customer, accessToken, refreshToken);
    } catch (err) {
      setOtpError(axios.isAxiosError(err) ? err.response?.data?.message ?? "Incorrect OTP" : "Incorrect OTP");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <AnimatePresence mode="wait">
        {step === "mobile" && (
          <motion.div key="mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-primary to-accent px-4 py-3 text-white shadow-lg">
              <LogoMark light className="h-9 w-auto" />
            </div>
            <h3 className="font-heading text-xl">Login to PujariDekho</h3>
            <p className="mt-1 text-sm text-muted-foreground">Enter your mobile number — no password needed.</p>

            <form onSubmit={handleSubmit(onRequestOtp)} className="mt-6 flex flex-col gap-4">
              <div>
                <Label htmlFor="otp-mobile" className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Mobile Number
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">+91</span>
                  <input
                    id="otp-mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    {...register("mobile")}
                    className="h-12 w-full rounded-lg border border-input bg-muted/60 pl-12 pr-4 text-base font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                {errors.mobile ? <p className="mt-1.5 text-xs text-destructive">{errors.mobile.message}</p> : null}
                {sendError ? <p className="mt-1.5 text-xs text-destructive">{sendError}</p> : null}
              </div>
              <Button type="submit" size="lg" className="font-ui font-bold" disabled={isSending}>
                {isSending && <Loader2 className="size-4 animate-spin" />}
                Send OTP
              </Button>
            </form>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-heading text-xl">Verify OTP</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Sent to <b className="text-foreground">+91 {mobile.slice(0, 5)} XXXXX</b>
            </p>

            {devOtp ? (
              <div className="mt-5 rounded-xl border border-dashed border-accent bg-accent/10 p-3.5 text-center">
                <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  LOGIN OTP
                </span>
                <span className="font-heading text-2xl tracking-[0.3em] text-primary">{devOtp}</span>
              </div>
            ) : null}

            <div className="mt-5 flex gap-2.5">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className={`h-13 w-full rounded-lg border text-center text-lg font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                    otpError ? "border-destructive bg-destructive/5" : "border-input bg-muted/60"
                  }`}
                />
              ))}
            </div>
            {otpError ? <p className="mt-2 text-xs text-destructive">{otpError}</p> : null}

            <Button onClick={verifyOtp} size="lg" className="font-ui mt-5 w-full font-bold" disabled={isVerifying}>
              {isVerifying && <Loader2 className="size-4 animate-spin" />}
              Verify &amp; Login
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Didn&apos;t get it?{" "}
              {cooldown > 0 ? (
                <span className="font-semibold">Resend in {cooldown}s</span>
              ) : (
                <button type="button" onClick={() => sendOtp(mobile)} className="font-bold text-primary" disabled={isSending}>
                  Resend OTP
                </button>
              )}
            </p>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-4 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 size={34} />
            </span>
            <h3 className="font-heading mt-4 text-xl">Welcome back!</h3>
            <p className="mt-1 text-sm text-muted-foreground">You&apos;re logged in to PujariDekho.</p>
            <Button onClick={() => handleClose(false)} size="lg" className="font-ui mt-5 w-full font-bold">
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
