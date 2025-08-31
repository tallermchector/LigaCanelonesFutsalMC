
import type { SVGProps } from "react";
import Image from 'next/image';
import { Globe } from 'lucide-react';


export function FutsalBallIcon({ width = 24, height = 24, ...props }: SVGProps<SVGSVGElement>) {
  return <Image src="/logofu.svg" alt="Futsal ball icon" width={Number(width)} height={Number(height)} {...props} />;
}

export const InstagramIcon = ({ width = 48, height = 48, ...props }: SVGProps<SVGSVGElement>) => (
  <Image src="/icon/icon-instagram.svg" alt="Instagram icon" width={Number(width)} height={Number(height)} {...props} />
);

export const FacebookIcon = ({ width = 48, height = 48, ...props }: SVGProps<SVGSVGElement>) => (
  <Image src="/icon/icon-facebook.svg" alt="Facebook icon" width={Number(width)} height={Number(height)} {...props} />
);

export const GlobeIcon = (props: SVGProps<SVGSVGElement>) => (
  <Globe {...props} />
);

export const YoutubeIcon = ({ width = 48, height = 48, ...props }: SVGProps<SVGSVGElement>) => (
    <Image src="/icon/icon-youtube.svg" alt="YouTube icon" width={Number(width)} height={Number(height)} {...props} />
);
