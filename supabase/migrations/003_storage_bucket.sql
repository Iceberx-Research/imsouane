-- Create public storage bucket for post media
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 5242880); -- 5MB limit

-- Allow anyone to read files (public bucket)
create policy "Public read access" on storage.objects
  for select using (bucket_id = 'media');

-- Allow anyone to upload files
create policy "Anyone can upload" on storage.objects
  for insert with check (bucket_id = 'media');
