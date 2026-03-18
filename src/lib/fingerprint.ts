import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { requireSupabase } from './supabase';

const DEVICE_TOKEN_KEY = 'imsouane_device_token';
const DEVICE_ID_KEY = 'imsouane_device_id';

let cachedToken: string | null = null;
let cachedDeviceId: string | null = null;

export async function getDeviceToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const stored = localStorage.getItem(DEVICE_TOKEN_KEY);
  if (stored) {
    cachedToken = stored;
    return stored;
  }

  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const token = result.visitorId;

  localStorage.setItem(DEVICE_TOKEN_KEY, token);
  cachedToken = token;
  return token;
}

export function getStoredDeviceId(): string | null {
  if (cachedDeviceId) return cachedDeviceId;
  cachedDeviceId = localStorage.getItem(DEVICE_ID_KEY);
  return cachedDeviceId;
}

function setDeviceId(id: string) {
  cachedDeviceId = id;
  localStorage.setItem(DEVICE_ID_KEY, id);
}

export async function registerDevice(nickname: string): Promise<{
  success: boolean;
  error?: string;
  deviceId?: string;
}> {
  const deviceToken = await getDeviceToken();

  // Check if this device already has a registration
  const { data: existingDevice } = await requireSupabase()
    .from('devices')
    .select('id, nickname')
    .eq('device_token', deviceToken)
    .single();

  if (existingDevice) {
    if (existingDevice.nickname === nickname) {
      // Same device, same nickname — just update last_seen
      await requireSupabase()
        .from('devices')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', existingDevice.id);
      setDeviceId(existingDevice.id);
      return { success: true, deviceId: existingDevice.id };
    }

    // Device exists with different nickname — check if new name is taken by another device
    const { data: nicknameTaken } = await requireSupabase()
      .from('devices')
      .select('id')
      .eq('nickname', nickname)
      .neq('device_token', deviceToken)
      .single();

    if (nicknameTaken) {
      return { success: false, error: 'This nickname is already taken.' };
    }

    // Update nickname on this device
    const { error } = await requireSupabase()
      .from('devices')
      .update({ nickname, last_seen_at: new Date().toISOString() })
      .eq('id', existingDevice.id);

    if (error) return { success: false, error: error.message };
    setDeviceId(existingDevice.id);
    return { success: true, deviceId: existingDevice.id };
  }

  // New device — check if nickname is already taken
  const { data: nicknameTaken } = await requireSupabase()
    .from('devices')
    .select('id')
    .eq('nickname', nickname)
    .single();

  if (nicknameTaken) {
    return { success: false, error: 'This nickname is already taken.' };
  }

  // Register new device
  const { data, error } = await requireSupabase()
    .from('devices')
    .insert({ device_token: deviceToken, nickname })
    .select('id')
    .single();

  if (error) return { success: false, error: error.message };
  setDeviceId(data.id);
  return { success: true, deviceId: data.id };
}

export async function checkNicknameAvailable(nickname: string): Promise<boolean> {
  const deviceToken = await getDeviceToken();
  const { data } = await requireSupabase()
    .from('devices')
    .select('id, device_token')
    .eq('nickname', nickname)
    .single();

  if (!data) return true;
  return data.device_token === deviceToken;
}
