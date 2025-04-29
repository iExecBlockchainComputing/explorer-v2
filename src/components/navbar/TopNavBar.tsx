import { Link } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { useLoginLogout } from '@/hooks/useLoginLogout';
import useUserStore from '@/stores/useUser.store';
import iExecLogo from '../../assets/iexec-logo.svg';
import { Button } from '../ui/button.tsx';
import { AddressChip } from './AddressChip.tsx';

export function TopNavBar() {
  const { isConnected, address } = useUserStore();
  const { logout, login } = useLoginLogout();

  return (
    <div className="flex items-center justify-between pt-5 lg:pt-10">
      <Link to="/" className="-m-2 flex items-center gap-2 p-2 font-mono">
        <img src={iExecLogo} width="25" height="25" alt="iExec logo" />
        iExec Explorer
      </Link>
      {isConnected ? (
        <div className="flex max-w-[1260px] items-center pr-10 lg:pr-0">
          <AddressChip address={address!} className="ml-6" />
          <button
            type="button"
            className="hover:drop-shadow-link-hover -mr-1 ml-2 p-1"
            onClick={() => logout()}
          >
            <LogOut size="20" />
          </button>
        </div>
      ) : (
        <Button className="px-10" onClick={login}>
          <span className="text-base font-semibold">Connect Wallet</span>
        </Button>
      )}
    </div>
  );
}
