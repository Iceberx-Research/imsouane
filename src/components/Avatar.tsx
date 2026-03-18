const AVATARS: [string, string][] = [
  ['🐪', 'bg-amber-100 text-amber-700'],
  ['🦎', 'bg-lime-100 text-lime-700'],
  ['🐙', 'bg-fuchsia-100 text-fuchsia-700'],
  ['🦊', 'bg-orange-100 text-orange-700'],
  ['🐢', 'bg-emerald-100 text-emerald-700'],
  ['🦜', 'bg-green-100 text-green-700'],
  ['🐬', 'bg-cyan-100 text-cyan-700'],
  ['🦋', 'bg-violet-100 text-violet-700'],
  ['🐝', 'bg-yellow-100 text-yellow-700'],
  ['🦈', 'bg-slate-100 text-slate-700'],
  ['🐠', 'bg-sky-100 text-sky-700'],
  ['🦩', 'bg-pink-100 text-pink-700'],
  ['🦀', 'bg-red-100 text-red-700'],
  ['🐋', 'bg-blue-100 text-blue-700'],
  ['🦅', 'bg-stone-100 text-stone-700'],
  ['🐚', 'bg-rose-100 text-rose-700'],
];

function hashNickname(nickname: string): number {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = ((hash << 5) - hash + nickname.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getAvatar(nickname: string): { emoji: string; colors: string } {
  const idx = hashNickname(nickname) % AVATARS.length;
  return { emoji: AVATARS[idx][0], colors: AVATARS[idx][1] };
}

export default function Avatar({ nickname, size = 'md' }: { nickname: string; size?: 'sm' | 'md' | 'lg' }) {
  const { emoji, colors } = getAvatar(nickname);
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-lg',
  };
  return (
    <div className={`${sizes[size]} ${colors} rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm shrink-0`}>
      {emoji}
    </div>
  );
}
