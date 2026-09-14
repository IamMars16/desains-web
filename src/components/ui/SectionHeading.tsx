import type { ReactNode } from "react";

interface Props {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}

export function SectionHeading({ title, eyebrow, children, as: Tag = "h2", className = "", id }: Props) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">{eyebrow}</p>}
      <Tag
        id={id}
        className={`font-semi-expanded font-bold leading-[1.08] text-fg ${
          Tag === "h1" ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl lg:text-[2.75rem]"
        } ${eyebrow ? "mt-4" : ""}`}
      >
        {title}
      </Tag>
      {children && <div className="mt-5 max-w-[62ch] text-lg text-fg-2">{children}</div>}
    </div>
  );
}
