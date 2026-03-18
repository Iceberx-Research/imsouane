import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getRepBadge } from './store';
import { registerDevice } from './fingerprint';
import { useReputation } from './hooks';

interface NicknameCtx {
  nickname: string | null;
  deviceId: string | null;
  setNickname: (name: string) => Promise<{ success: boolean; error?: string }>;
  reputation: number;
  repBadge: string;
  requireNickname: () => boolean;
  showModal: boolean;
  closeModal: () => void;
}

const NicknameContext = createContext<NicknameCtx>({
  nickname: null,
  deviceId: null,
  setNickname: async () => ({ success: true }),
  reputation: 0,
  repBadge: '\uD83D\uDC2A',
  requireNickname: () => false,
  showModal: false,
  closeModal: () => {},
});

function NicknameProviderInner({ children }: { children: ReactNode }) {
  const [nickname, setNicknameState] = useState<string | null>(
    () => localStorage.getItem('imsouane_nickname')
  );
  const [deviceId, setDeviceId] = useState<string | null>(
    () => localStorage.getItem('imsouane_device_id')
  );
  const [showModal, setShowModal] = useState(!nickname);

  const { data: reputation = 0 } = useReputation(nickname);
  const repBadge = getRepBadge(reputation);

  // On mount, verify existing nickname with fingerprint
  useEffect(() => {
    if (nickname) {
      registerDevice(nickname).then(result => {
        if (result.success && result.deviceId) {
          setDeviceId(result.deviceId);
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setNickname = useCallback(async (name: string): Promise<{ success: boolean; error?: string }> => {
    const result = await registerDevice(name);
    if (result.success) {
      localStorage.setItem('imsouane_nickname', name);
      setNicknameState(name);
      setDeviceId(result.deviceId || null);
      setShowModal(false);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const requireNickname = useCallback((): boolean => {
    if (nickname && deviceId) return true;
    setShowModal(true);
    return false;
  }, [nickname, deviceId]);

  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <NicknameContext.Provider value={{ nickname, deviceId, setNickname, reputation, repBadge, requireNickname, showModal, closeModal }}>
      {children}
    </NicknameContext.Provider>
  );
}

export function NicknameProvider({ children }: { children: ReactNode }) {
  return <NicknameProviderInner>{children}</NicknameProviderInner>;
}

export function useNickname() {
  return useContext(NicknameContext);
}
