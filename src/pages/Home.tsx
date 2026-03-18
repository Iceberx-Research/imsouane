import { Link } from 'react-router-dom';
import CamelMascot from '../components/CamelMascot';
import Avatar from '../components/Avatar';
import { MessageSquare, Bell, ArrowRight, Loader2, Waves } from 'lucide-react';
import { getTagLabel, getTagColors } from '../lib/store';
import { useRecentPosts, useRecentServices, useRecentSurfPosts } from '../lib/hooks';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const { data: latestPosts = [], isLoading: postsLoading } = useRecentPosts();
  const { data: latestServices = [], isLoading: servicesLoading } = useRecentServices();
  const { data: latestSurfPosts = [], isLoading: surfLoading } = useRecentSurfPosts();

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-4">
        <CamelMascot className="w-24 h-24 text-terracotta mb-4" />
        <h1 className="text-4xl sm:text-5xl font-heading font-black text-dark mb-2">
          The village has a voice now.
        </h1>
        <p className="text-lg text-dark/80 mb-6 font-sans">
          No accounts. No algorithms. Just Imsouane.
        </p>
        <Link
          to="/feed"
          className="bg-ocean text-paper px-8 py-3 rounded-full font-bold shadow-md hover:bg-ocean/90 transition transform hover:scale-105 inline-flex items-center gap-2"
        >
          Enter the Community <ArrowRight size={18} />
        </Link>
      </section>

      {/* Camel Hero Image */}
      <section className="rounded-xl overflow-hidden shadow-sm border border-mgreen/20 bg-paper flex items-center justify-center">
        <img src="/camel.png" alt="Imsouane Camel" className="w-full h-auto object-contain" />
      </section>

      {/* Wave divider */}
      <div className="wave-divider" />

      {/* Quick Previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Latest Feed Posts Preview */}
        <section className="bg-paper p-5 rounded-xl shadow-sm border border-mgreen/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
              <MessageSquare className="text-ocean" size={20} /> Recent Chatter
            </h2>
            <Link to="/feed" className="text-sm text-ocean hover:underline font-medium">View all</Link>
          </div>
          {postsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-ocean animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {latestPosts.map(post => {
                const tagColors = getTagColors(post.tag);
                return (
                  <Link to={`/post/${post.id}`} key={post.id} className="pb-3 border-b border-sand last:border-0 last:pb-0 block hover:bg-sand/20 -mx-2 px-2 py-1 rounded-lg transition">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar nickname={post.nickname} size="sm" />
                      <span className="font-mono text-xs text-terracotta font-medium">{post.nickname}</span>
                      <span className="text-[10px] text-dark/40">· {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                    <h3 className="font-medium text-dark text-sm line-clamp-2">{post.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColors.bg} ${tagColors.text}`}>
                        {getTagLabel(post.tag)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Latest Services Preview */}
        <section className="bg-paper p-5 rounded-xl shadow-sm border border-mgreen/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
              <Bell className="text-terracotta" size={20} /> Latest Services
            </h2>
            <Link to="/services" className="text-sm text-ocean hover:underline font-medium">View all</Link>
          </div>
          {servicesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-ocean animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {latestServices.map(service => (
                <Link to={`/post/${service.id}`} key={service.id} className="pb-3 border-b border-sand last:border-0 last:pb-0 block hover:bg-sand/20 -mx-2 px-2 py-1 rounded-lg transition">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      service.service_type === 'offering' ? 'text-mgreen bg-mgreen/10' : 'text-terracotta bg-terracotta/10'
                    }`}>
                      {service.service_type === 'offering' ? 'Offering' : 'Looking for'}
                    </span>
                    {service.price && <span className="text-xs font-bold text-dark">{service.price}</span>}
                  </div>
                  <h3 className="font-medium text-dark text-sm">{service.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Avatar nickname={service.nickname} size="sm" />
                    <span className="font-mono text-xs text-terracotta">{service.nickname}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Surf Section */}
      <section className="bg-paper p-5 rounded-xl shadow-sm border border-ocean/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold flex items-center gap-2">
            <Waves className="text-ocean" size={20} /> Surf Talk
          </h2>
          <Link to="/feed" className="text-sm text-ocean hover:underline font-medium">View all</Link>
        </div>
        {surfLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-ocean animate-spin" />
          </div>
        ) : latestSurfPosts.length === 0 ? (
          <p className="text-sm text-dark/40 text-center py-6">No surf posts yet. Be the first to share a session report!</p>
        ) : (
          <div className="flex flex-col gap-3">
            {latestSurfPosts.map(post => (
              <Link to={`/post/${post.id}`} key={post.id} className="pb-3 border-b border-sand last:border-0 last:pb-0 block hover:bg-sand/20 -mx-2 px-2 py-1 rounded-lg transition">
                <div className="flex items-center gap-2 mb-1">
                  <Avatar nickname={post.nickname} size="sm" />
                  <span className="font-mono text-xs text-terracotta font-medium">{post.nickname}</span>
                  <span className="text-[10px] text-dark/40">· {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                </div>
                <h3 className="font-medium text-dark text-sm line-clamp-2">{post.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
