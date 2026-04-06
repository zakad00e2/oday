"use client";

import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export default function Skeleton({ className = "", ...props }: SkeletonProps) {
  const classes = ["animate-pulse bg-[#E5E7EB]", className]
    .filter(Boolean)
    .join(" ");

  return <div aria-hidden="true" className={classes} {...props} />;
}
