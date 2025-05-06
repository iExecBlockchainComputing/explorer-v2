import { cn } from '@/lib/utils';
import {
  SiDiscord,
  SiMedium,
  SiTelegram,
  SiX,
  SiYoutube,
} from '@icons-pack/react-simple-icons';
import { Link } from '@tanstack/react-router';
import { Linkedin } from 'lucide-react';
import iExecLogo from '../assets/iexec-logo.svg';
import { Button } from './ui/button';

export function Footer({ className }: { className?: string }) {
  const navLinks = [
    { href: 'https://www.iex.ec/', label: 'iExec Website' },
    { href: 'https://blockscout-bellecour.iex.ec/', label: 'Blockscout' },
    { href: 'https://www.iex.ec/contact', label: 'Contact Us' },
  ];

  const socialLinks = [
    { href: 'https://twitter.com/iEx_ec', icon: <SiX size={16} /> },
    { href: 'https://discord.gg/pbt9m98wnU', icon: <SiDiscord size={16} /> },
    { href: 'https://t.me/iexec_rlc_official', icon: <SiTelegram size={16} /> },
    {
      href: 'https://www.youtube.com/channel/UCwWxZWvKVHn3CXnmDooLWtA',
      icon: <SiYoutube size={16} />,
    },
    {
      href: 'https://www.linkedin.com/company/iex.ec/',
      icon: <Linkedin size={16} />,
    },
    { href: 'https://medium.com/iex-ec', icon: <SiMedium size={16} /> },
  ];

  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const displayYear =
    currentYear > startYear
      ? `${startYear} - ${currentYear}`
      : `${currentYear}`;

  return (
    <footer
      className={cn(
        'bg-grey-800 border-muted text-grey-200 rounded-3xl border p-10 sm:p-20',
        className
      )}
    >
      <div className="grid place-items-center justify-center gap-10 xl:grid-cols-3 xl:place-items-stretch">
        <Link to="/" className="flex items-center gap-2 font-mono">
          <img src={iExecLogo} width="25" height="25" alt="iExec logo" />
          <span className="hidden sm:block">iExec Explorer</span>
        </Link>

        <nav className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-4">
          {navLinks.map(({ href, label }, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Button
                asChild
                variant="link"
                className="text-grey-200 p-2 font-mono"
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </Button>
              {idx < navLinks.length - 1 && (
                <span className="bg-grey-200 hidden size-1.5 rounded-full sm:block" />
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center xl:justify-end">
          {socialLinks.map(({ href, icon }, idx) => (
            <Button
              key={idx}
              asChild
              variant="link"
              className="text-grey-200 p-2"
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Social link"
              >
                {icon}
              </a>
            </Button>
          ))}
        </div>
      </div>

      <hr className="border-grey-500 mt-10 mb-4" />
      <p className="w-full text-center text-sm">
        © All Rights Reserved {displayYear}
      </p>
    </footer>
  );
}
