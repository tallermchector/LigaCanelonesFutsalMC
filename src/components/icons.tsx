
import type { SVGProps } from "react";
import Image, { type ImageProps } from 'next/image';
import { Globe } from 'lucide-react';

type CustomIconProps = Omit<ImageProps, 'src' | 'alt'>;

export function FutsalBallIcon({ width = 24, height = 24, ...props }: CustomIconProps) {
  return <Image src="/logofu.svg" alt="Futsal ball icon" width={width} height={height} {...props} />;
}

export const InstagramIcon = ({ width = 48, height = 48, ...props }: CustomIconProps) => (
  <Image src="/icon/icon-instagram.svg" alt="Instagram icon" width={width} height={height} {...props} />
);

export const FacebookIcon = ({ width = 48, height = 48, ...props }: CustomIconProps) => (
  <Image src="/icon/icon-facebook.svg" alt="Facebook icon" width={width} height={height} {...props} />
);

export const WhatsAppIcon = ({ width = 48, height = 48, ...props }: CustomIconProps) => (
  <Image src="/icon/icon-whatsapp.svg" alt="WhatsApp icon" width={width} height={height} {...props} />
);

export const GlobeIcon = (props: SVGProps<SVGSVGElement>) => (
  <Globe {...props} />
);

export const YoutubeIcon = ({ width = 48, height = 48, ...props }: CustomIconProps) => (
    <Image src="/icon/icon-youtube.svg" alt="YouTube icon" width={width} height={height} {...props} />
);

export const GoalIcon = ({ width = 24, height = 24, ...props }: CustomIconProps) => (
    <Image src="/icon/icon-gol.svg" alt="Goal icon" width={width} height={height} {...props} />
);

export const FoulIcon = ({ width = 24, height = 24, ...props }: CustomIconProps) => (
    <Image src="/icon/icon-falta.svg" alt="Foul icon" width={width} height={height} {...props} />
);

export const YellowCardIcon = ({ width = 24, height = 24, ...props }: CustomIconProps) => (
    <Image src="/icon/icon-amarilla.svg" alt="Yellow card icon" width={width} height={height} {...props} />
);

export const RedCardIcon = ({ width = 24, height = 24, ...props }: CustomIconProps) => (
    <Image src="/icon/icon-roja.svg" alt="Red card icon" width={width} height={height} {...props} />
);
