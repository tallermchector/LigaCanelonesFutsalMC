import type { SVGProps } from "react";
import Image from 'next/image';
import { Instagram, Facebook, Globe, Youtube } from 'lucide-react';


export function FutsalBallIcon(props: SVGProps<SVGSVGElement>) {
  // Return an Image component pointing to the new SVG
  // The props like className can be passed to the Image component for styling
  return <Image src="/logofu.svg" alt="Futsal ball icon" width={24} height={24} {...props} />;
}

export const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <Instagram {...props} />
);

export const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <Facebook {...props} />
);

export const GlobeIcon = (props: SVGProps<SVGSVGElement>) => (
  <Globe {...props} />
);

export const YoutubeIcon = (props: SVGProps<SVGSVGElement>) => (
    <Youtube {...props} />
);
