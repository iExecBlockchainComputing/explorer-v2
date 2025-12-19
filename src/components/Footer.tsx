import { cn } from '@/lib/utils';
import {
  SiDiscord,
  SiMedium,
  SiTelegram,
  SiX,
  SiYoutube,
} from '@icons-pack/react-simple-icons';
import { Linkedin } from 'lucide-react';
import useUserStore from '@/stores/useUser.store';
import { getBlockExplorerUrl } from '@/utils/chain.utils';
import iExecLogo from '../assets/iexec-logo.svg';
import { ChainLink } from './ChainLink';
import { Button } from './ui/button';

function SocialLinksItems({ className }: { className?: string }) {
  const socialLinks = [
    {
      href: 'https://twitter.com/iEx_ec',
      icon: <SiX size={16} />,
      ariaLabel: 'Twitter',
    },
    {
      href: 'https://discord.gg/pbt9m98wnU',
      icon: <SiDiscord size={16} />,
      ariaLabel: 'Discord',
    },
    {
      href: 'https://t.me/iexec_rlc_official',
      icon: <SiTelegram size={16} />,
      ariaLabel: 'Telegram',
    },
    {
      href: 'https://www.youtube.com/channel/UCwWxZWvKVHn3CXnmDooLWtA',
      icon: <SiYoutube size={16} />,
      ariaLabel: 'YouTube',
    },
    {
      href: 'https://www.linkedin.com/company/iex.ec/',
      icon: <Linkedin size={16} />,
      ariaLabel: 'LinkedIn',
    },
    {
      href: 'https://medium.com/iex-ec',
      icon: <SiMedium size={16} />,
      ariaLabel: 'Medium',
    },
  ];
  return (
    <div className={cn('flex', className)}>
      {socialLinks.map(({ href, icon, ariaLabel }, idx) => (
        <Button
          key={idx}
          asChild
          variant="link"
          className="text-intermediate-foreground p-2"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
          >
            {icon}
          </a>
        </Button>
      ))}
    </div>
  );
}

export function Footer({ className }: { className?: string }) {
  const { chainId } = useUserStore();

  const navLinks = [
    { href: 'https://www.iex.ec/', label: 'iExec Website' },
    { href: 'https://docs.iex.ec/', label: 'Documentation' },
    ...(chainId !== undefined
      ? [{ href: getBlockExplorerUrl(chainId), label: 'Block explorer' }]
      : []),
    { href: 'https://www.iex.ec/contact', label: 'Contact Us' },
  ];

  const startYear = 2017;
  const currentYear = new Date().getFullYear();
  const displayYear =
    currentYear > startYear
      ? `${startYear} - ${currentYear}`
      : `${currentYear}`;

  return (
    <footer
      className={cn(
        'text-intermediate-foreground flex flex-col gap-6 py-10',
        className
      )}
    >
      <div className="flex flex-col items-center justify-between gap-10 xl:flex-row">
        <ChainLink
          to="/"
          aria-label="Home"
          className="flex items-center gap-2 font-mono"
        >
          <img src={iExecLogo} width="25" height="25" alt="" />
          <span>iExec Explorer</span>
        </ChainLink>

        <nav className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          {navLinks.map(({ href, label }, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Button
                asChild
                variant="link"
                className="text-intermediate-foreground p-2 font-mono"
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </Button>
              {idx < navLinks.length - 1 && (
                <span className="bg-intermediate-foreground hidden size-1.5 rounded-full md:block" />
              )}
            </div>
          ))}
        </nav>
        <SocialLinksItems className="xl:hidden" />
      </div>

      <hr className="border-intermediate" />

      <div className="flex justify-between">
        <p className="w-full text-center text-sm xl:text-left">
          © All Rights Reserved {displayYear}
        </p>
        <SocialLinksItems className="hidden xl:flex" />
      </div>
    </footer>
  );
}
