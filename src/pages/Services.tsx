import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Waves, Bed, Sailboat, MapPin, MoreHorizontal, Phone, Loader2 } from 'lucide-react';
import CamelMascot from '../components/CamelMascot';
import { getRepBadge, type ServiceType, type ServiceCategory } from '../lib/store';
import { useServicesInfinite, useReputation } from '../lib/hooks';
import { formatDistanceToNow } from 'date-fns';

const CATEGORIES: { name: ServiceCategory; icon: React.ReactNode }[] = [
  { name: 'Airport Transfer', icon: <Plane size={14} /> },
  { name: 'Surf Lessons', icon: <Waves size={14} /> },
  { name: 'Accommodation', icon: <Bed size={14} /> },
  { name: 'Board Rental', icon: <Sailboat size={14} /> },
  { name: 'Guide/Tour', icon: <MapPin size={14} /> },
  { name: 'Other', icon: <MoreHorizontal size={14} /> },
];

function ServiceRepBadge({ nickname }: { nickname: string }) {
  const { data: rep = 0 } = useReputation(nickname);
  return <span className="text-sm">{getRepBadge(rep)}</span>;
}

export default function Services() {
  const [mode, setMode] = useState<ServiceType>('offering');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useServicesInfinite(mode, selectedCategory ?? undefined);

  const services = data?.pages.flatMap(p => p.posts) ?? [];

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-dark">Services</h1>
          <p className="text-dark/60 text-sm">Need a ride? Selling a board?</p>
        </div>
      </div>

      {/* Offering / Looking For toggle */}
      <div className="bg-paper p-1 rounded-xl shadow-sm border border-mgreen/20 flex relative overflow-hidden">
        <button
          className={`flex-1 py-3 text-sm font-bold transition-colors z-10 ${mode === 'offering' ? 'text-white' : 'text-dark/60 hover:text-dark'}`}
          onClick={() => setMode('offering')}
        >
          Offering
        </button>
        <button
          className={`flex-1 py-3 text-sm font-bold transition-colors z-10 ${mode === 'looking_for' ? 'text-white' : 'text-dark/60 hover:text-dark'}`}
          onClick={() => setMode('looking_for')}
        >
          Looking For
        </button>
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-transform duration-300 ease-in-out
            ${mode === 'offering' ? 'bg-mgreen transform translate-x-1' : 'bg-terracotta transform translate-x-[calc(100%+6px)]'}
          `}
        />
      </div>

      {/* Category chips */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-2 transition
              ${selectedCategory === cat.name
                ? 'bg-dark text-paper border-dark'
                : 'bg-paper text-dark/70 border-sand hover:bg-sand/30'
              }
            `}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-ocean animate-spin" />
        </div>
      )}

      {/* Service Cards Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-paper/50 rounded-2xl border border-dashed border-dark/20 mt-4">
              <CamelMascot className="w-20 h-20 text-dark/20 mb-4" />
              <p className="text-dark/60 font-medium">
                {mode === 'offering'
                  ? "No one's offering anything today."
                  : "No one's looking for anything right now."}
              </p>
              <p className="text-sm text-dark/40 mt-1">Maybe you should.</p>
            </div>
          ) : (
            services.map(service => (
              <Link
                to={`/post/${service.id}`}
                key={service.id}
                className="bg-paper p-5 rounded-2xl shadow-sm border border-mgreen/10 hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                    service.service_type === 'offering' ? 'text-mgreen bg-mgreen/10' : 'text-terracotta bg-terracotta/10'
                  }`}>
                    {service.service_category}
                  </span>
                  {service.price && (
                    <span className="text-sm font-black text-dark bg-sand/50 px-3 py-1 rounded-full">
                      {service.price}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-dark leading-snug">{service.title}</h3>
                <p className="text-sm text-dark/60 line-clamp-2">{service.body}</p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-sand/50">
                  <div className="flex items-center gap-2">
                    <ServiceRepBadge nickname={service.nickname} />
                    <span className="font-mono text-xs text-terracotta font-bold">{service.nickname}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-dark/40 text-xs">
                    <Phone size={12} />
                    <span>{formatDistanceToNow(new Date(service.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </Link>
            ))
          )}

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-4 col-span-full" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-4 col-span-full">
              <Loader2 className="w-6 h-6 text-ocean animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
