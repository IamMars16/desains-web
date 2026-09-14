import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text";

const styles: Record<Variant, string> = {
  primary:
    "bg-gold text-on-gold hover:bg-gold-hover px-5 py-3 font-semibold active:translate-y-px",
  secondary:
    "border border-line-strong text-fg hover:border-fg-2 hover:bg-hover px-5 py-3 font-medium active:translate-y-px",
  text: "text-fg underline-offset-8 decoration-gold/60 hover:underline py-2 font-medium",
};

interface Props extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
  external?: boolean;
}

export function ButtonLink({ variant = "primary", className = "", icon, children, external, ...rest }: Props) {
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xs text-[0.95rem] transition-colors duration-200 ${styles[variant]} ${className}`;
  if (external) {
    return (
      <a href={String(rest.href)} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
        {icon}
      </a>
    );
  }
  return (
    <Link className={cls} {...rest}>
      {children}
      {icon}
    </Link>
  );
}
