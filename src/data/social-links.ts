
import type { SocialLink } from '@/types';
import { InstagramIcon, FacebookIcon, GlobeIcon, YoutubeIcon } from '@/components/icons';

export const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/ligacanariadefutsaloficial/',
    icon: InstagramIcon,
    imageUrl: 'https://picsum.photos/1920/1080?random=1',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/Ligacanariadefutsal',
    icon: FacebookIcon,
    imageUrl: 'https://picsum.photos/1920/1080?random=2',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@ligacanariadefutsaltv',
    icon: YoutubeIcon,
    imageUrl: 'https://picsum.photos/1920/1080?random=3',
  },
  {
    name: 'Sitio Web',
    url: 'https://ligacanelonesfutsalmc.netlify.app/',
    icon: GlobeIcon,
    imageUrl: 'https://picsum.photos/1920/1080?random=4',
  },
];
