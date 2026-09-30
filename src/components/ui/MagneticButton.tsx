import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode, MouseEvent as ReactMouseEvent, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";

/**
 * The label, letter by letter, each wrapped in an overflow-hidden mask with a
 * twin "echo" waiting below. On hover the real letter rises out and the echo
 * rises in — a rolling type swap. Kept as a separate component so the button
 * markup stays readable.
 */
function RollingLabel({ text }: { text: string }) {
  return (
    <span className="btn-label relative inline-flex overflow-hidden">
      {[...text].map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className="relative inline-block overflow-hidden"
          style={{ "--letter-index": index } as CSSProperties}
        >
          <span className="btn-letter-inner">{letter === " " ? "\u00A0" : letter}</span>
          <span aria-hidden="true" className="btn-letter-echo absolute inset-0">
            {letter === " " ? "\u00A0" : letter}
          </span>
        </span>
      ))}
    </span>
  );
}

export type ButtonVariant = "primary" | "gold" | "light" | "outline" | "outlineLight" | "ghost";
export type ButtonSize = "md" | "lg";

type VariantStyle = {
  /** Background, border, text and shadow treatment. */
  surface: string;
  /** Click-ripple colour, matched to the surface. */
  ripple: string;
  /** Which gradient hairline the button wears on hover. */
  ring: "bright" | "soft";
};

const VARIANTS: Record<ButtonVariant, VariantStyle> = {
  primary: {
    // An oversized gradient that drifts continuously — the button feels alive
    // before anyone touches it.
    surface:
      "bg-[linear-gradient(110deg,#143A5C_0%,#0A1A2E_38%,#1B4E77_70%,#0A1A2E_100%)] bg-[length:220%_100%] animate-pan text-white shadow-[0_12px_34px_-14px_rgba(10,26,46,0.85)] hover:shadow-[0_22px_52px_-16px_rgba(10,26,46,0.9)]",
    ripple: "bg-white/30",
    ring: "bright",
  },
  gold: {
    surface:
      "bg-[linear-gradient(110deg,#EFC87F_0%,#D4902C_40%,#F6DFB4_68%,#D4902C_100%)] bg-[length:220%_100%] animate-pan text-navy-950 shadow-[0_12px_34px_-14px_rgba(212,144,44,0.85)] hover:shadow-[0_22px_52px_-16px_rgba(212,144,44,0.75)]",
    ripple: "bg-navy-950/25",
    ring: "bright",
  },
  light: {
    surface:
      "bg-white text-navy-950 shadow-[0_12px_34px_-16px_rgba(0,0,0,0.65)] hover:bg-navy-50 hover:shadow-[0_22px_48px_-18px_rgba(0,0,0,0.55)]",
    ripple: "bg-navy-950/15",
    ring: "bright",
  },
  outline: {
    surface:
      "border border-navy-900/20 bg-white/40 text-navy-900 backdrop-blur-sm hover:border-navy-900/45 hover:bg-navy-900/[0.04]",
    ripple: "bg-navy-950/15",
    ring: "bright",
  },
  outlineLight: {
    surface:
      "border border-white/25 bg-white/[0.06] text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/12",
    ripple: "bg-white/30",
    ring: "bright",
  },
  ghost: {
    surface: "text-navy-800 hover:bg-navy-900/5",
    ripple: "bg-navy-950/12",
    ring: "soft",
  },
};

const SIZES: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-[0.9rem]",
  lg: "px-7 py-4 text-[0.95rem]",
};

/**
 * CTA button with layered motion:
 *  · a magnetic pull toward the cursor, with a subtle 3D tilt
 *  · a rotating gradient hairline that appears on hover and keyboard focus
 *  · a light sweep across the surface
 *  · a ripple from the exact point of the click
 *  · the icon swaps itself out by sliding down
 *
 * All of it is decorative — the element stays a real link/button, so keyboard
 * focus, activation and screen readers behave normally.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  icon,
  ariaLabel,
  external = false,
  strength = 0.22,
  block = false,
  wrapperClassName,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: ReactNode;
  ariaLabel?: string;
  external?: boolean;
  strength?: number;
  /** Stretch to the full width of the parent (used in the mobile menu). */
  block?: boolean;
  wrapperClassName?: string;
}) {
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.35 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.35 });

  /* Depth: the pull translates into a small rotation, so the button leans into
     the pointer instead of sliding flat across the page. */
  const rotateY = useTransform(x, (value) => value * 0.32);
  const rotateX = useTransform(y, (value) => -value * 0.32);

  const [ripples, setRipples] = useState<{ id: number; left: number; top: number; size: number }[]>([]);
  const rippleId = useMotionValue(0);

  useEffect(() => {
    if (!ripples.length) return;
    const timer = window.setTimeout(() => setRipples((current) => current.slice(1)), 700);
    return () => window.clearTimeout(timer);
  }, [ripples]);

  const handleMove = (event: ReactMouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (!reduced) {
      const rect = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.1;
      const id = rippleId.get() + 1;
      rippleId.set(id);
      setRipples((current) => [
        ...current.slice(-2),
        { id, left: event.clientX - rect.left, top: event.clientY - rect.top, size },
      ]);
    }
    onClick?.();
  };

  const style = VARIANTS[variant];
  const label = typeof children === "string" ? children : null;

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-tight",
    "transition-[background-color,border-color,box-shadow,transform,filter] duration-300 ease-out",
    "active:scale-[0.97]",
    style.surface,
    SIZES[size],
    className,
  );

  const content = (
    <>
      {/* rotating gradient hairline — peeks out from behind the surface */}
      <span
        aria-hidden="true"
        className={cn(
          "ring-gradient pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100 group-focus-visible:opacity-100",
          style.ring === "soft" && "ring-gradient-soft",
        )}
      />
      {/* light sweep */}
      <span aria-hidden="true" className="sheen" />
      {/* corner brackets folding in on hover */}
      <span aria-hidden="true" className="btn-corner btn-corner-tl" />
      <span aria-hidden="true" className="btn-corner btn-corner-tr" />
      <span aria-hidden="true" className="btn-corner btn-corner-bl" />
      <span aria-hidden="true" className="btn-corner btn-corner-br" />
      {/* a satellite dot orbiting the button's edge on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <span className="absolute inset-0 animate-turn motion-reduce:animate-none">
          <span className="absolute top-0 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300 shadow-[0_0_8px_rgba(239,211,161,0.9)]" />
        </span>
      </span>
      {/* click ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          className={cn("pointer-events-none absolute rounded-full animate-ripple", style.ripple)}
          style={{
            left: ripple.left - ripple.size / 2,
            top: ripple.top - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      <span className="relative z-10">{label ? <RollingLabel text={label} /> : children}</span>

      {icon && (
        /* The old icon slides out downwards while its twin slides in. */
        <span className="relative z-10 block size-[1.1rem] overflow-hidden">
          <span className="absolute inset-0 grid place-items-center transition-transform duration-300 ease-out group-hover:translate-y-full group-hover:opacity-0">
            {icon}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 grid -translate-y-full place-items-center transition-transform duration-300 ease-out group-hover:translate-y-0"
          >
            {icon}
          </span>
        </span>
      )}
    </>
  );

  return (
    <motion.div
      ref={wrapperRef}
      style={{ x, y, rotateX, rotateY, transformPerspective: 700 }}
      className={cn(block ? "block w-full" : "inline-block", wrapperClassName)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {href ? (
        <a
          href={href}
          aria-label={ariaLabel}
          className={classes}
          onClick={handleClick}
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
          {content}
        </a>
      ) : (
        <button type={type} onClick={handleClick} aria-label={ariaLabel} className={classes}>
          {content}
        </button>
      )}
    </motion.div>
  );
}