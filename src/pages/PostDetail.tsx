import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUp, MessageSquare, ChevronLeft, Send, Loader2, FileText, Download } from 'lucide-react';
import CamelMascot from '../components/CamelMascot';
import Avatar from '../components/Avatar';
import { getTagLabel, getTagColors } from '../lib/store';
import { useNickname } from '../lib/nickname';
import { usePost, useComments, useCreateComment, useToggleVote } from '../lib/hooks';
import { formatDistanceToNow } from 'date-fns';

export default function PostDetail() {
  const { id } = useParams();
  const { requireNickname } = useNickname();
  const [commentText, setCommentText] = useState('');

  const { data: post, isLoading: postLoading } = usePost(id!);
  const { data: comments = [] } = useComments(id!);
  const createComment = useCreateComment(id!);
  const toggleVote = useToggleVote();

  if (postLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-ocean animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center mt-12">
        <CamelMascot className="w-20 h-20 text-dark/20 mb-4" />
        <p className="text-dark/60 font-medium">This post wandered off into the desert.</p>
        <Link to="/feed" className="text-ocean font-bold mt-4 hover:underline">Back to Feed</Link>
      </div>
    );
  }

  const tagColors = getTagColors(post.tag);

  const handleUpvotePost = () => {
    if (!requireNickname()) return;
    toggleVote.mutate({ postId: post.id });
  };

  const handleUpvoteComment = (commentId: string) => {
    if (!requireNickname()) return;
    toggleVote.mutate({ commentId });
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    if (!requireNickname()) return;
    createComment.mutate(commentText.trim());
    setCommentText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-20 sm:pb-8">
      <Link to="/feed" className="inline-flex items-center gap-2 text-dark/50 hover:text-ocean text-sm font-bold w-fit transition">
        <ChevronLeft size={18} />
        Back to Feed
      </Link>

      {/* Post Content */}
      <article className="bg-paper p-6 rounded-2xl shadow-sm border border-mgreen/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar nickname={post.nickname} size="lg" />
            <div className="flex flex-col">
              <span className="font-mono text-sm text-terracotta font-bold">{post.nickname}</span>
              <span className="text-xs text-dark/40 font-medium">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${tagColors.bg} ${tagColors.text}`}>
            {getTagLabel(post.tag)}
          </span>
        </div>

        <h1 className="text-2xl font-heading font-black text-dark mb-4">{post.title}</h1>
        <p className="text-dark/80 whitespace-pre-wrap leading-relaxed font-sans mb-4">{post.body}</p>

        {/* Media attachment */}
        {post.media_url && post.media_type === 'image' && (
          <a href={post.media_url} target="_blank" rel="noopener noreferrer" className="block mb-4">
            <img
              src={post.media_url}
              alt="Post attachment"
              className="w-full max-h-[500px] object-contain rounded-xl border border-sand/50 bg-sand/20"
            />
          </a>
        )}
        {post.media_url && post.media_type === 'pdf' && (
          <a
            href={post.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 mb-4 p-4 bg-sand/30 rounded-xl border border-sand hover:bg-sand/50 transition"
          >
            <FileText size={24} className="text-mred shrink-0" />
            <span className="text-sm font-medium text-dark">View attached PDF</span>
            <Download size={16} className="text-dark/40 ml-auto shrink-0" />
          </a>
        )}

        {/* Service-specific info */}
        {post.tag === 'service' && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-sand/30 rounded-xl">
            {post.service_category && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-mgreen/10 text-mgreen">{post.service_category}</span>
            )}
            {post.service_type && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                post.service_type === 'offering' ? 'bg-mgreen/10 text-mgreen' : 'bg-terracotta/10 text-terracotta'
              }`}>
                {post.service_type === 'offering' ? 'Offering' : 'Looking for'}
              </span>
            )}
            {post.price && (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-dark/10 text-dark">{post.price}</span>
            )}
            {post.contact && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-ocean/10 text-ocean">{post.contact}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-sand/50">
          <button
            onClick={handleUpvotePost}
            className={`flex items-center gap-2 font-bold px-4 py-2 rounded-full transition ${
              post.has_voted ? 'text-terracotta bg-terracotta/10' : 'text-dark/40 hover:text-terracotta hover:bg-terracotta/5'
            }`}
          >
            <ArrowUp size={20} strokeWidth={3} />
            <span className="text-sm">{post.upvote_count}</span>
          </button>
          <div className="flex items-center gap-2 font-medium text-dark/40">
            <MessageSquare size={18} />
            <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="flex flex-col gap-4 mt-2">
        <h2 className="text-xl font-heading font-black text-dark">Comments</h2>

        {/* Comment Form */}
        <div className="bg-paper p-1 rounded-2xl shadow-sm border border-mgreen/10 flex items-end">
          <textarea
            placeholder="Say something nice..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent p-4 min-h-[44px] text-sm resize-none focus:outline-none text-dark font-sans"
            rows={1}
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || createComment.isPending}
            className="m-1 bg-ocean text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-ocean/90 transition shadow-sm disabled:opacity-40 flex items-center gap-1.5"
          >
            {createComment.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Post
          </button>
        </div>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="flex flex-col items-center p-8 text-center">
            <p className="text-dark/40 text-sm">Silence... just the waves. Say something.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-2">
            {comments.map(comment => (
              <div key={comment.id} className="bg-paper/80 p-4 rounded-xl border border-mgreen/10 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Avatar nickname={comment.nickname} size="sm" />
                  <span className="font-mono text-xs text-ocean font-bold">{comment.nickname}</span>
                  <span className="text-[10px] text-dark/30 font-medium ml-1">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-dark/80 leading-relaxed font-sans pl-1">{comment.body}</p>
                <div className="flex gap-4 mt-1 pl-1">
                  <button
                    onClick={() => handleUpvoteComment(comment.id)}
                    className={`flex items-center gap-1.5 font-bold transition ${
                      comment.has_voted ? 'text-terracotta' : 'text-dark/30 hover:text-terracotta'
                    }`}
                  >
                    <ArrowUp size={14} strokeWidth={2.5} />
                    <span className="text-xs">{comment.upvote_count}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
