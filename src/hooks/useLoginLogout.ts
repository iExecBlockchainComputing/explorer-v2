import { useAuth } from '@clerk/clerk-react';
import { useAppKit } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';

export function useLoginLogout() {
  const { open } = useAppKit();
  const { disconnectAsync } = useDisconnect();
  const { signOut, isSignedIn } = useAuth()

  const logout = async () => {
    if (isSignedIn) {
      signOut()
    }
    try {
      await disconnectAsync();
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const login = () => {
    open({ view: 'Connect' });
  };

  return {
    login,
    logout,
  };
}
