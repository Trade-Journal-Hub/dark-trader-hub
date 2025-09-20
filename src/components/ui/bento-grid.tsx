import { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  style?: React.CSSProperties;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[18rem] sm:auto-rows-[20rem] lg:auto-rows-[22rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  style,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-white/10 backdrop-blur-sm [box-shadow:0_0_0_1px_rgba(255,255,255,.1),0_2px_4px_rgba(0,0,0,.1),0_12px_24px_rgba(0,0,0,.1)]",
      // dark styles - enhanced for black background with hover animations
      "transform-gpu border border-white/20 hover:border-gradient-to-r hover:from-cyan-400/60 hover:to-purple-400/60 transition-all duration-700 hover:shadow-2xl hover:shadow-cyan-500/30 hover:scale-[1.02] hover:-translate-y-2 hover:bg-white/15",
      className,
    )}
    style={style}
    {...props}
  >
    <div>{background}</div>
    <div className="p-4 flex flex-col justify-end h-full">
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2 transition-all duration-300">
        <Icon className="h-10 w-10 origin-left transform-gpu text-white transition-all duration-500 ease-out group-hover:scale-105 group-hover:text-cyan-400 group-hover:rotate-6 group-hover:drop-shadow-lg" />
        <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-500 leading-tight">
          {name}
        </h3>
        <p className="text-sm text-gray-300 leading-snug line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">{description}</p>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-700 group-hover:bg-gradient-to-br group-hover:from-cyan-400/10 group-hover:via-purple-400/5 group-hover:to-pink-400/10" />
  </div>
);

export { BentoCard, BentoGrid };
