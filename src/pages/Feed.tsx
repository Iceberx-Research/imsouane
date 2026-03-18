import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUp, MessageSquare, Loader2 } from 'lucide-react';
import CamelMascot from '../components/CamelMascot';
import Avatar from '../components/Avatar';
import { getTagLabel, getTagColors, type Tag } from '../lib/store';
import { useNickname } from '../lib/nickname';
import { usePostsInfinite, useToggleVote } from '../lib/hooks';
import { formatDistanceToNow } from 'date-fns';

const TAGS: { value: Tag | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'surf', label: 'Surf' },
  { value: 'question', label: 'Question' },
  { value: 'for_sale', label: 'For Sale' },
  { value: 'lost_found', label: 'Lost & Found' },
  { value: 'event', label: 'Event' },
  { value: 'general', label: 'General' },
];


export default function Feed() {
  const [sort, setSort] = useState<'new' | 'hot'>('new');
  const [tagFilter, setTagFilter] = useState<Tag | 'all'>('all');
  const { requireNickname } = useNickname();
  const toggleVote = useToggleVote();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePostsInfinite(sort, tagFilter === 'all' ? undefined : tagFilter);

  const posts = data?.pages.flatMap(p => p.posts) ?? [];

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleUpvote = useCallback((postId: string) => {
    if (!requireNickname()) return;
    toggleVote.mutate({ postId });
  }, [requireNickname, toggleVote]);

  return (
    <div className="flex flex-col gap-5 relative min-h-[calc(100vh-140px)]">
      {/* Header & Sort */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-dark">The Feed</h1>
          <p className="text-dark/60 text-sm">What's happening in the village</p>
        </div>
        <div className="flex bg-paper rounded-full p-1 shadow-sm border border-mgreen/20">
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${sort === 'new' ? 'bg-ocean text-paper' : 'text-dark/60 hover:text-dark'}`}
            onClick={() => setSort('new')}
          >
            New
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${sort === 'hot' ? 'bg-terracotta text-paper' : 'text-dark/60 hover:text-dark'}`}
            onClick={() => setSort('hot')}
          >
            Hot
          </button>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex overflow-x-auto pb-1 -mx-4 px-4 gap-2 scrollbar-none">
        {TAGS.map(t => (
          <button
            key={t.value}
            onClick={() => setTagFilter(t.value)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition border ${
              tagFilter === t.value
                ? 'bg-dark text-paper border-dark'
                : 'bg-paper text-dark/60 border-sand hover:bg-sand/30'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-ocean animate-spin" />
        </div>
      )}

      {/* Post List */}
      {!isLoading && (
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-paper/50 rounded-2xl border border-dashed border-dark/20 mt-8">
              <CamelMascot className="w-20 h-20 text-dark/20 mb-4" />
              <p className="text-dark/60 font-medium">The camel hasn't heard any news yet.</p>
              <p className="text-sm text-dark/40 mt-1">Be the first to post.</p>
            </div>
          ) : (
            posts.map(post => {
              const tagColors = getTagColors(post.tag);
              return (
                <article key={post.id} className="bg-paper p-5 rounded-2xl shadow-sm border border-mgreen/10 hover:shadow-md transition-shadow">
                  <Link to={`/post/${post.id}`} className="block">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar nickname={post.nickname} size="sm" />
                      <span className="font-mono text-xs text-terracotta font-bold">{post.nickname}</span>
                      <span className="text-[10px] text-dark/40">· {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      <span className={`ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full ${tagColors.bg} ${tagColors.text}`}>
                        {getTagLabel(post.tag)}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-dark mb-1 leading-snug">{post.title}</h2>
                    <div className="flex gap-3">
                      <p className="text-sm text-dark/60 line-clamp-2 leading-relaxed flex-1">{post.body}</p>
                      {post.media_url && post.media_type === 'image' && (
                        <img src={post.media_url} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0 border border-sand/50" />
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-sand/50">
                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full transition text-sm ${
                        post.has_voted
                          ? 'text-terracotta bg-terracotta/10'
                          : 'text-dark/40 hover:text-terracotta hover:bg-terracotta/5'
                      }`}
                    >
                      <ArrowUp size={16} strokeWidth={2.5} />
                      {post.upvote_count}
                    </button>
                    <Link to={`/post/${post.id}`} className="flex items-center gap-1.5 text-dark/40 hover:text-ocean transition text-sm font-medium">
                      <MessageSquare size={16} />
                      {post.comment_count}
                    </Link>
                  </div>
                </article>
              );
            })
          )}

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-4" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 text-ocean animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <Link
        to="/new"
        className="fixed bottom-20 right-4 sm:bottom-8 sm:right-auto sm:left-1/2 sm:ml-[280px] w-14 h-14 bg-ocean rounded-full shadow-lg text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-40"
      >
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
