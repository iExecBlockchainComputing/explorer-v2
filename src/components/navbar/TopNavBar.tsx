import { Link } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useLoginLogout } from '@/hooks/useLoginLogout';
import useUserStore from '@/stores/useUser.store';
import iExecLogo from '../../assets/iexec-logo.svg';
import { Button } from '../ui/button.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';
import { AddressChip } from './AddressChip.tsx';

export function TopNavBar() {
  const { isConnected, address } = useUserStore();
  const { logout, login } = useLoginLogout();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="flex items-center justify-between pt-6 lg:pt-3">
      <Link to="/" className="-m-2 flex items-center gap-2 p-2 font-mono">
        <img src={iExecLogo} width="25" height="25" alt="iExec logo" />
        <span className="hidden sm:block">iExec Explorer</span>
      </Link>
      <div className="mr-10 flex items-center gap-2 md:mr-0">
        <div className="content hidden md:flex">
          {isConnected && (
            <Button variant="link" className="text-accent-foreground">
              iExec Account
            </Button>
          )}
          <Select value="bellecour">
            <SelectTrigger className="">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bellecour">
                <img src={iExecLogo} className="size-4" alt="" /> Bellecour
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isConnected ? (
          <div className="flex max-w-[1260px] items-center gap-2">
            <AddressChip address={address!} className="ml-2" />

            <button
              type="button"
              className="hover:drop-shadow-link-hover -mr-1 ml-2 p-1"
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
          className="group/checkbox pointer-events-auto fixed top-7 right-6 z-30 flex size-5 w-[26px] origin-center transform flex-col justify-between"
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
          <span className="pointer-events-none block h-0.5 w-[26px] origin-right transform rounded-full bg-white duration-200 group-has-[:checked]/checkbox:-rotate-45"></span>
          <span className="pointer-events-none block h-0.5 w-[26px] origin-top-right transform rounded-full bg-white duration-200 group-has-[:checked]/checkbox:scale-x-0"></span>
          <span className="pointer-events-none block h-0.5 w-[26px] origin-right transform rounded-full bg-white duration-200 group-has-[:checked]/checkbox:rotate-45"></span>
        </label>

        <div className="border-grey-600 bg-grey-900 fixed inset-y-0 left-0 z-10 flex w-full -translate-x-full flex-col overflow-auto rounded-r-3xl border-r px-5 pt-5 duration-300 group-has-[:checked]:translate-x-0 lg:w-[255px] lg:translate-x-0">
          <Link
            to="/"
            className="-m-2 flex items-center gap-2 p-2 font-mono"
            onClick={handleMenuToggle}
          >
            <img src={iExecLogo} width="25" height="25" alt="iExec logo" />
            iExec Explorer
          </Link>

          <div className="left-navbar text-grey-400 mt-10 flex grow flex-col gap-10">
            {isConnected && (
              <Button variant="link" className="text-accent-foreground w-max">
                iExec Account
              </Button>
            )}
            <Select value="bellecour">
              <SelectTrigger className="">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bellecour">
                  <img src={iExecLogo} className="size-4" alt="" /> Bellecour
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="mb-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
