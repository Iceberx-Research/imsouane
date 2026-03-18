-- Add media attachment support to posts (1 file per post: image or PDF)
alter table posts add column media_url text;
alter table posts add column media_type text check (media_type in ('image', 'pdf'));
