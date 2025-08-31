
import type { SocialLink } from '@/types';
import { InstagramIcon, FacebookIcon, GlobeIcon, YoutubeIcon } from '@/components/icons';

const createBg = (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><defs><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.05 0.2" numOctaves="3" result="noise" /><feColorMatrix in="noise" type="saturate" values="0" result="grayscale" /><feComponentTransfer in="grayscale" result="coloredNoise"><feFuncR type="linear" slope="4" intercept="0" /><feFuncG type="linear" slope="4" intercept="0" /><feFuncB type="linear" slope="4" intercept="0" /></feComponentTransfer><feFlood flood-color="${color}" result="color" /><feComposite in="color" in2="coloredNoise" operator="in" result="texture" /><feBlend in="SourceGraphic" in2="texture" mode="multiply" /></filter></defs><rect width="100%" height="100%" filter="url(#f)" /></svg>`;

export const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/ligacanariadefutsaloficial/',
    icon: InstagramIcon,
    background: createBg('#E1306C'),
    color: '#E1306C',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/Ligacanariadefutsal',
    icon: FacebookIcon,
    background: createBg('#1877F2'),
    color: '#1877F2',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@ligacanariadefutsaltv',
    icon: YoutubeIcon,
    background: createBg('#FF0000'),
    color: '#FF0000',
  },
  {
    name: 'Sitio Web',
    url: 'https://ligacanelonesfutsalmc.netlify.app/',
    icon: GlobeIcon,
    background: createBg('#800020'),
    color: 'hsl(var(--primary))',
  },
];
