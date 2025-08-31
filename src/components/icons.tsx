import type { SVGProps } from "react";
import Image from 'next/image';

export function FutsalBallIcon(props: SVGProps<SVGSVGElement>) {
  // Return an Image component pointing to the new SVG
  // The props like className can be passed to the Image component for styling
  return <Image src="/logofu.svg" alt="Futsal ball icon" width={24} height={24} {...props} />;
}
