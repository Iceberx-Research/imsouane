import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ImagePlus, FileText, X } from 'lucide-react';
import { type Tag, type ServiceType, type ServiceCategory } from '../lib/store';
import { useNickname } from '../lib/nickname';
import { useCreatePost } from '../lib/hooks';

const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Airport Transfer', 'Surf Lessons', 'Accommodation', 'Board Rental', 'Guide/Tour', 'Other'
];

export default function NewPost() {
  const [type, setType] = useState<'post' | 'service'>('post');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState<Tag>('general');
  const [serviceType, setServiceType] = useState<ServiceType>('offering');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('Airport Transfer');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { requireNickname } = useNickname();
  const createPost = useCreatePost();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    if (selected.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireNickname()) return;
    if (!title.trim()) return;
    setError('');

    try {
      const post = await createPost.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        tag: type === 'service' ? 'service' : tag,
        serviceType: type === 'service' ? serviceType : undefined,
        serviceCategory: type === 'service' ? serviceCategory : undefined,
        price: type === 'service' && price.trim() ? price.trim() : undefined,
        contact: type === 'service' && contact.trim() ? contact.trim() : undefined,
        file: file || undefined,
      });

      navigate(`/post/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post. Try again.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto mt-4 pb-20 sm:pb-8">
      <div>
        <h1 className="text-3xl font-heading font-black text-dark mb-1">New Post</h1>
        <p className="text-dark/60 text-sm">Post it. Someone here knows.</p>
      </div>

      <div className="bg-paper p-1 rounded-xl shadow-sm border border-mgreen/20 flex relative overflow-hidden">
        <button
          type="button"
          onClick={() => setType('post')}
          className={`flex-1 py-3 text-sm font-bold transition-colors z-10 ${type === 'post' ? 'text-white' : 'text-dark/70'}`}
        >
          Community Post
        </button>
        <button
          type="button"
          onClick={() => setType('service')}
          className={`flex-1 py-3 text-sm font-bold transition-colors z-10 ${type === 'service' ? 'text-white' : 'text-dark/70'}`}
        >
          Service Listing
        </button>
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-transform duration-300 ease-in-out
            ${type === 'post' ? 'bg-ocean transform translate-x-1' : 'bg-terracotta transform translate-x-[calc(100%+6px)]'}
          `}
        />
      </div>

      {error && (
        <div className="bg-mred/10 text-mred text-sm font-medium px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-dark/80">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={type === 'post' ? "Ask a question, share news..." : "What are you offering or looking for?"}
            className="bg-paper border border-sand rounded-xl px-4 py-3 placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean text-dark font-sans"
            required
          />
        </div>

        {type === 'post' && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-dark/80">Tag</label>
            <select
              value={tag}
              onChange={e => setTag(e.target.value as Tag)}
              className="bg-paper border border-sand rounded-xl px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-ocean/50 font-sans"
            >
              <option value="general">General</option>
              <option value="surf">Surf</option>
              <option value="question">Question</option>
              <option value="for_sale">For Sale</option>
              <option value="lost_found">Lost & Found</option>
              <option value="event">Event</option>
            </select>
          </div>
        )}

        {type === 'service' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-dark/80">Type</label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as ServiceType)}
                  className="bg-paper border border-sand rounded-xl px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-terracotta/50 font-sans"
                >
                  <option value="offering">Offering</option>
                  <option value="looking_for">Looking For</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-dark/80">Category</label>
                <select
                  value={serviceCategory}
                  onChange={e => setServiceCategory(e.target.value as ServiceCategory)}
                  className="bg-paper border border-sand rounded-xl px-4 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-terracotta/50 font-sans"
                >
                  {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-dark/80">Price (Optional)</label>
                <input
                  type="text"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="e.g. 200 MAD, Free..."
                  className="bg-paper border border-sand rounded-xl px-4 py-3 placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-terracotta/50 text-dark font-sans"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-dark/80">Contact (WhatsApp)</label>
                <input
                  type="text"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  placeholder="+212 6..."
                  className="bg-paper border border-sand rounded-xl px-4 py-3 placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-terracotta/50 text-dark font-sans"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-dark/80">Details</label>
          <textarea
            rows={5}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Add more context..."
            className="bg-paper border border-sand rounded-xl px-4 py-3 placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean text-dark resize-none font-sans"
          ></textarea>
        </div>

        {/* File Attachment */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-dark/80">Attach Image or PDF (Optional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div className="flex items-center gap-3 bg-sand/30 border border-sand rounded-xl p-3">
              {preview ? (
                <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-16 bg-mred/10 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-mred" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark truncate">{file.name}</p>
                <p className="text-xs text-dark/40">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button type="button" onClick={clearFile} className="p-1.5 rounded-full hover:bg-dark/10 transition">
                <X size={16} className="text-dark/50" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 border-2 border-dashed border-sand rounded-xl px-4 py-6 text-dark/40 hover:border-ocean/40 hover:text-ocean/60 transition"
            >
              <ImagePlus size={20} />
              <span className="text-sm font-medium">Tap to add a photo or PDF</span>
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={createPost.isPending}
          className={`w-full py-4 mt-2 rounded-xl text-paper font-black text-lg transition shadow-md hover:-translate-y-0.5 disabled:opacity-60
            ${type === 'post' ? 'bg-ocean hover:bg-ocean/90 shadow-ocean/20' : 'bg-terracotta hover:bg-terracotta/90 shadow-terracotta/20'}
          `}
        >
          {createPost.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin" /> Publishing...
            </span>
          ) : (
            'Publish to Village'
          )}
        </button>
      </form>
    </div>
  );
}
