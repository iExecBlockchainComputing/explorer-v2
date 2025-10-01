import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useLoginLogout } from '@/hooks/useLoginLogout';
import useUserStore from '@/stores/useUser.store';
import iExecLogo from '../../assets/iexec-logo.svg';
import { ChainLink } from '../ChainLink.tsx';
import { ModeToggle } from '../ModeToggle.tsx';
import { Button } from '../ui/button.tsx';
import { AddressChip } from './AddressChip.tsx';
import { ChainSelector } from './ChainSelector.tsx';

export function Navbar() {
  const { isConnected, address } = useUserStore();
  const { logout, login } = useLoginLogout();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState);
  };

  return (
    <nav className="flex items-center justify-between py-6">
      <ChainLink to="/" className="-m-2 flex items-center gap-2 p-2 font-mono">
        <img src={iExecLogo} width="25" height="25" alt="iExec logo" />
        <span className="hidden sm:block">iExec Explorer</span>
      </ChainLink>
      <div className="mr-8 flex items-center gap-4 md:mr-0">
        {isConnected && (
          <div className="hidden md:flex">
            <Button variant="link" asChild className="text-foreground">
              <ChainLink to="/account">iExec Account</ChainLink>
            </Button>
            <span className="border-secondary border-l" />
          </div>
        )}
        <div className="content hidden gap-4 md:flex">
          <ModeToggle />
          <ChainSelector />
        </div>
        {isConnected ? (
          <div className="flex max-w-[1260px] items-center gap-2">
            <AddressChip address={address!} />

            <button
              type="button"
              className="hover:drop-shadow-link-hover p-1"
              onClick={() => logout()}
            >
              <LogOut size="20" />
            </button>
          </div>
        ) : (
          <Button onClick={login}>
            <span className="text-base font-semibold">Connect Wallet</span>
          </Button>
        )}
      </div>

      <div className="group pointer-events-none absolute inset-0 md:hidden">
        <label
          className="group/checkbox pointer-events-auto fixed top-8.5 right-6 z-30 flex size-4 origin-center transform flex-col justify-between"
          htmlFor="menu"
          onClick={handleMenuToggle}
        >
          <input
            type="checkbox"
            className="absolute -inset-2 size-10 cursor-pointer appearance-none bg-transparent"
            name="menu"
            id="menu"
            checked={isMenuOpen}
            readOnly
          />
          <span className="bg-foreground pointer-events-none block h-0.5 w-4.5 origin-right transform rounded-full duration-200 group-has-[:checked]/checkbox:mt-[0.5px] group-has-[:checked]/checkbox:-rotate-45"></span>
          <span className="bg-foreground pointer-events-none block h-0.5 w-4.5 origin-top-right transform rounded-full duration-200 group-has-[:checked]/checkbox:scale-x-0"></span>
          <span className="bg-foreground pointer-events-none block h-0.5 w-4.5 origin-right transform rounded-full duration-200 group-has-[:checked]/checkbox:mb-[0.5px] group-has-[:checked]/checkbox:rotate-45"></span>
        </label>

        <div className="border-secondary bg-background pointer-events-auto fixed inset-y-0 left-0 z-10 flex w-full -translate-x-full flex-col overflow-auto rounded-r-3xl border-r px-6 pt-6 duration-200 group-has-[:checked]:translate-x-0 lg:w-[255px] lg:translate-x-0">
          <div className="-m-2 mr-6 flex items-center justify-between gap-2 py-2 pl-2">
            <ChainLink to="/" className="font-mono" onClick={handleMenuToggle}>
              <img src={iExecLogo} width="25" height="25" alt="iExec logo" />
            </ChainLink>
            {isConnected ? (
              <div className="flex max-w-[1260px] items-center gap-2">
                <AddressChip address={address!} />

                <button
                  type="button"
                  className="hover:drop-shadow-link-hover p-1"
                  onClick={() => logout()}
                >
                  <LogOut size="20" />
                </button>
              </div>
            ) : (
              <Button onClick={login}>
                <span className="text-base font-semibold">Connect Wallet</span>
              </Button>
            )}
          </div>

          <div className="left-navbar border-muted -mx-6 mt-6 flex grow flex-col gap-4 border-t px-6 pt-2">
            <ModeToggle />
            <Button
              variant="link"
              asChild
              className="text-foreground justify-baseline px-3"
            >
              <ChainLink to="/account">iExec Account</ChainLink>
            </Button>
            <ChainSelector className="w-full border-0" />
          </div>
        </div>
      </div>
    </nav>
  );
}
