import type { SVGProps } from "react";

export function FutsalBallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 0-4.95 1.82" />
      <path d="M12 22a10 10 0 0 1-4.95-1.82" />
      <path d="M7.05 3.82a10 10 0 0 0-3.23 3.23" />
      <path d="M16.95 20.18a10 10 0 0 1-3.23-3.23" />
      <path d="M3.82 7.05a10 10 0 0 0 0 9.9" />
      <path d="M20.18 16.95a10 10 0 0 1 0-9.9" />
      <path d="M12 12l4.95-1.82" />
      <path d="M12 12l-4.95 1.82" />
      <path d="M12 12l-1.82-4.95" />
      <path d="M12 12l1.82 4.95" />
    </svg>
  );
}
