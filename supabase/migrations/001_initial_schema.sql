-- ==========================================
-- DEVICES table (fingerprint-bound identity)
-- ==========================================
create table devices (
  id            uuid primary key default gen_random_uuid(),
  device_token  text unique not null,
  nickname      text unique not null,
  created_at    timestamptz default now(),
  last_seen_at  timestamptz default now()
);

create index idx_devices_token on devices (device_token);
create index idx_devices_nickname on devices (nickname);

-- ==========================================
-- POSTS table
-- ==========================================
create table posts (
  id                uuid primary key default gen_random_uuid(),
  device_id         uuid references devices(id) not null,
  nickname          text not null,
  title             text not null,
  body              text not null default '',
  tag               text not null check (tag in ('question','for_sale','lost_found','event','general','service')),
  service_type      text check (service_type in ('offering','looking_for')),
  service_category  text,
  price             text,
  contact           text,
  upvote_count      int default 0,
  comment_count     int default 0,
  created_at        timestamptz default now()
);

create index idx_posts_created on posts (created_at desc);
create index idx_posts_tag on posts (tag);
create index idx_posts_device on posts (device_id);
create index idx_posts_tag_created on posts (tag, created_at desc);

-- ==========================================
-- COMMENTS table
-- ==========================================
create table comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid references posts(id) on delete cascade not null,
  device_id   uuid references devices(id) not null,
  nickname    text not null,
  body        text not null,
  upvote_count int default 0,
  created_at  timestamptz default now()
);

create index idx_comments_post on comments (post_id, created_at asc);
create index idx_comments_device on comments (device_id);

-- ==========================================
-- VOTES table (unified for posts and comments)
-- ==========================================
create table votes (
  id           uuid primary key default gen_random_uuid(),
  device_id    uuid references devices(id) not null,
  post_id      uuid references posts(id) on delete cascade,
  comment_id   uuid references comments(id) on delete cascade,
  created_at   timestamptz default now(),
  constraint unique_post_vote unique (device_id, post_id),
  constraint unique_comment_vote unique (device_id, comment_id),
  constraint vote_target check (
    (post_id is not null and comment_id is null) or
    (post_id is null and comment_id is not null)
  )
);

create index idx_votes_device_post on votes (device_id, post_id) where post_id is not null;
create index idx_votes_device_comment on votes (device_id, comment_id) where comment_id is not null;

-- ==========================================
-- RATE LIMITING table
-- ==========================================
create table rate_limits (
  id          uuid primary key default gen_random_uuid(),
  device_id   uuid references devices(id) not null,
  action_type text not null,
  created_at  timestamptz default now()
);

create index idx_rate_limits_device_action on rate_limits (device_id, action_type, created_at desc);

-- ==========================================
-- TRIGGER: Auto-update comment_count on posts
-- ==========================================
create or replace function update_comment_count() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update posts set comment_count = comment_count + 1 where id = NEW.post_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update posts set comment_count = comment_count - 1 where id = OLD.post_id;
    return OLD;
  end if;
end;
$$ language plpgsql;

create trigger trg_comment_count
  after insert or delete on comments
  for each row execute function update_comment_count();

-- ==========================================
-- TRIGGER: Auto-update upvote_count on posts/comments
-- ==========================================
create or replace function update_upvote_count() returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    if NEW.post_id is not null then
      update posts set upvote_count = upvote_count + 1 where id = NEW.post_id;
    elsif NEW.comment_id is not null then
      update comments set upvote_count = upvote_count + 1 where id = NEW.comment_id;
    end if;
    return NEW;
  elsif TG_OP = 'DELETE' then
    if OLD.post_id is not null then
      update posts set upvote_count = upvote_count - 1 where id = OLD.post_id;
    elsif OLD.comment_id is not null then
      update comments set upvote_count = upvote_count - 1 where id = OLD.comment_id;
    end if;
    return OLD;
  end if;
end;
$$ language plpgsql;

create trigger trg_upvote_count
  after insert or delete on votes
  for each row execute function update_upvote_count();

-- ==========================================
-- RATE LIMITING FUNCTION
-- ==========================================
create or replace function check_rate_limit(
  p_device_id uuid,
  p_action text,
  p_max_count int,
  p_window_minutes int
) returns boolean as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from rate_limits
  where device_id = p_device_id
    and action_type = p_action
    and created_at > now() - (p_window_minutes || ' minutes')::interval;
  return recent_count < p_max_count;
end;
$$ language plpgsql;

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================
alter table devices enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table votes enable row level security;
alter table rate_limits enable row level security;

-- Public reads
create policy "Anyone can read devices" on devices for select using (true);
create policy "Anyone can read posts" on posts for select using (true);
create policy "Anyone can read comments" on comments for select using (true);
create policy "Anyone can read votes" on votes for select using (true);

-- Writes
create policy "Devices can register" on devices for insert with check (true);
create policy "Devices can update last_seen" on devices for update using (true);
create policy "Anyone can post" on posts for insert with check (true);
create policy "Anyone can comment" on comments for insert with check (true);
create policy "Anyone can vote" on votes for insert with check (true);
create policy "Anyone can unvote" on votes for delete using (true);
create policy "Rate limits can be inserted" on rate_limits for insert with check (true);
