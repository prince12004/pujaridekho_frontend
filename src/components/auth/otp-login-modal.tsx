"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, User } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const mobileSchema = z.object({
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
});

type MobileValues = z.infer<typeof mobileSchema>;
type Step = "mobile" | "otp" | "success";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function OtpLoginModal({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (mobile: string) => void;
}) {
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    reset: resetMobileForm,
    formState: { errors },
  } = useForm<MobileValues>({ resolver: zodResolver(mobileSchema) });

  function resetAll() {
    setStep("mobile");
    setMobile("");
    setDevOtp("");
    setOtpDigits(Array(6).fill(""));
    setOtpError(false);
    resetMobileForm();
  }

  function handleClose(next: boolean) {
    if (!next) resetAll();
    onOpenChange(next);
  }

  function onRequestOtp(values: MobileValues) {
    setMobile(values.mobile);
    setDevOtp(generateOtp());
    setOtpDigits(Array(6).fill(""));
    setOtpError(false);
    setStep("otp");
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    setOtpError(false);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function verifyOtp() {
    const entered = otpDigits.join("");
    if (entered.length === 6 && entered === devOtp) {
      setStep("success");
      onSuccess?.(mobile);
    } else {
      setOtpError(true);
    }
  }

  function resendOtp() {
    setDevOtp(generateOtp());
    setOtpDigits(Array(6).fill(""));
    setOtpError(false);
    inputRefs.current[0]?.focus();
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <AnimatePresence mode="wait">
        {step === "mobile" && (
          <motion.div key="mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
              <User size={24} />
            </div>
            <h3 className="font-heading text-xl">Login to PujariDekho</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your mobile number — no password needed.
            </p>

            <form onSubmit={handleSubmit(onRequestOtp)} className="mt-6 flex flex-col gap-4">
              <div>
                <Label htmlFor="otp-mobile" className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Mobile Number
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                    +91
                  </span>
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
                {errors.mobile ? (
                  <p className="mt-1.5 text-xs text-destructive">{errors.mobile.message}</p>
                ) : null}
              </div>
              <Button type="submit" size="lg" className="font-ui font-bold">
                Generate OTP
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
              Sent to <b className="text-foreground">+91 {mobile.slice(0, 5)} XXXXX</b> ·{" "}
              <span className="font-bold text-primary">Development Mode</span>
            </p>

            <div className="mt-5 rounded-xl border border-dashed border-accent bg-accent/10 p-3.5 text-center">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Dev Mode — Your OTP
              </span>
              <span className="font-heading text-2xl tracking-[0.3em] text-primary">{devOtp}</span>
            </div>

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
            {otpError ? (
              <p className="mt-2 text-xs text-destructive">
                Incorrect OTP. Please check the dev-mode OTP shown above.
              </p>
            ) : null}

            <Button onClick={verifyOtp} size="lg" className="font-ui mt-5 w-full font-bold">
              Verify &amp; Login
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Didn&apos;t get it?{" "}
              <button type="button" onClick={resendOtp} className="font-bold text-primary">
                Resend OTP
              </button>
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
