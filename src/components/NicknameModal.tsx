import { useState, useEffect, useRef } from 'react';
import { generateNickname } from '../lib/supabase';
import { useNickname } from '../lib/nickname';
import { checkNicknameAvailable } from '../lib/fingerprint';
import CamelMascot from './CamelMascot';
import { ArrowRight } from 'lucide-react';

export default function NicknameModal() {
  const { setNickname: saveNickname, closeModal } = useNickname();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setNickname(generateNickname());
  }, []);

  // Debounced availability check
  useEffect(() => {
    if (nickname.length < 3) {
      setError('');
      return;
    }

    setChecking(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const available = await checkNicknameAvailable(nickname);
      setChecking(false);
      if (!available) {
        setError('This nickname is taken.');
      } else {
        setError('');
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [nickname]);

  const handleShuffle = () => {
    setNickname(generateNickname());
    setError('');
  };

  const handleSave = async () => {
    if (!nickname.trim() || nickname.length < 3 || error) return;
    setLoading(true);
    setError('');
    try {
      const result = await saveNickname(nickname.trim());
      if (!result.success) {
        setError(result.error || 'Failed to register. Try another nickname.');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
      console.error('Error saving nickname', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4">
      <div className="bg-paper p-8 rounded-3xl shadow-xl w-full max-w-sm flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
        <CamelMascot className="w-16 h-16 text-ocean mb-4" />
        <h2 className="text-2xl font-heading font-black text-dark mb-2">Pick your alias</h2>
        <p className="text-sm text-dark/60 font-sans mb-6">
          No email. No password. Just a nickname to comment and post in the village.
        </p>

        <div className="w-full relative mb-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={`w-full bg-sand/30 border-2 rounded-xl px-4 py-3 text-center font-mono font-bold text-lg text-dark focus:outline-none focus:ring-2 transition ${
              error
                ? 'border-mred focus:border-mred focus:ring-mred/20'
                : 'border-sand focus:border-ocean focus:ring-ocean/20'
            }`}
            placeholder="Nickname"
            maxLength={20}
          />
          <button
            onClick={handleShuffle}
            type="button"
            title="Generate Random"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-ocean transition p-1"
          >
            🎲
          </button>
        </div>

        {/* Error / checking status */}
        <div className="w-full h-6 mb-4">
          {error && (
            <p className="text-xs text-mred font-medium">{error}</p>
          )}
          {checking && !error && nickname.length >= 3 && (
            <p className="text-xs text-dark/40 font-medium">Checking availability...</p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading || nickname.length < 3 || !!error || checking}
          className="w-full bg-dark text-paper font-bold py-3.5 rounded-xl shadow-md hover:bg-dark/90 transition flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'Enter Village'} <ArrowRight size={18} />
        </button>

        {closeModal && (
          <button onClick={closeModal} className="mt-3 text-sm text-dark/40 hover:text-dark/60 transition">
            Maybe later
          </button>
        )}
      </div>
    </div>
  );
}
