import imageCompression from 'browser-image-compression';
import { requireSupabase } from './supabase';
import { getStoredDeviceId } from './fingerprint';
import type { Tag, ServiceType, ServiceCategory } from './store';

export interface DbPost {
  id: string;
  device_id: string;
  nickname: string;
  title: string;
  body: string;
  tag: Tag;
  service_type: ServiceType | null;
  service_category: string | null;
  price: string | null;
  contact: string | null;
  media_url: string | null;
  media_type: 'image' | 'pdf' | null;
  upvote_count: number;
  comment_count: number;
  created_at: string;
  has_voted?: boolean;
}

export interface DbComment {
  id: string;
  post_id: string;
  device_id: string;
  nickname: string;
  body: string;
  upvote_count: number;
  created_at: string;
  has_voted?: boolean;
}

const PAGE_SIZE = 20;

// ---------- POSTS ----------

export async function fetchPosts(params: {
  sort: 'new' | 'hot';
  tag?: Tag;
  page: number;
}): Promise<{ posts: DbPost[]; hasMore: boolean }> {
  const deviceId = getStoredDeviceId();
  const from = params.page * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  const supabase = requireSupabase();
  let query = supabase
    .from('posts')
    .select('*')
    .neq('tag', 'service')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params.tag) {
    query = query.eq('tag', params.tag);
  }

  const { data, error } = await query;
  if (error) throw error;

  let posts: DbPost[] = data || [];

  // Fetch vote status for current device
  if (deviceId && posts.length > 0) {
    const postIds = posts.map(p => p.id);
    const { data: votes } = await supabase
      .from('votes')
      .select('post_id')
      .eq('device_id', deviceId)
      .in('post_id', postIds);

    const votedPostIds = new Set((votes || []).map(v => v.post_id));
    posts = posts.map(p => ({ ...p, has_voted: votedPostIds.has(p.id) }));
  }

  // Client-side hot sort
  if (params.sort === 'hot') {
    posts.sort((a, b) => {
      const hoursA = (Date.now() - new Date(a.created_at).getTime()) / 3600000;
      const hoursB = (Date.now() - new Date(b.created_at).getTime()) / 3600000;
      return (b.upvote_count / Math.pow(hoursB + 2, 1.5)) -
             (a.upvote_count / Math.pow(hoursA + 2, 1.5));
    });
  }

  return {
    posts: posts.slice(0, PAGE_SIZE),
    hasMore: (data || []).length > PAGE_SIZE,
  };
}

export async function fetchServices(params: {
  mode?: ServiceType;
  category?: ServiceCategory;
  page: number;
}): Promise<{ posts: DbPost[]; hasMore: boolean }> {
  const from = params.page * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  const supabase = requireSupabase();
  let query = supabase
    .from('posts')
    .select('*')
    .eq('tag', 'service')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params.mode) query = query.eq('service_type', params.mode);
  if (params.category) query = query.eq('service_category', params.category);

  const { data, error } = await query;
  if (error) throw error;
  return { posts: data || [], hasMore: (data || []).length > PAGE_SIZE };
}

export async function fetchPost(id: string): Promise<DbPost | null> {
  const supabase = requireSupabase();
  const deviceId = getStoredDeviceId();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  let hasVoted = false;
  if (deviceId) {
    const { data: vote } = await supabase
      .from('votes')
      .select('id')
      .eq('device_id', deviceId)
      .eq('post_id', id)
      .single();
    hasVoted = !!vote;
  }

  return { ...data, has_voted: hasVoted };
}

export async function fetchComments(postId: string): Promise<DbComment[]> {
  const supabase = requireSupabase();
  const deviceId = getStoredDeviceId();

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  let comments: DbComment[] = data || [];

  if (deviceId && comments.length > 0) {
    const commentIds = comments.map(c => c.id);
    const { data: votes } = await supabase
      .from('votes')
      .select('comment_id')
      .eq('device_id', deviceId)
      .in('comment_id', commentIds);

    const votedCommentIds = new Set((votes || []).map(v => v.comment_id));
    comments = comments.map(c => ({ ...c, has_voted: votedCommentIds.has(c.id) }));
  }

  return comments;
}

// ---------- HOME PAGE (limited queries) ----------

export async function fetchRecentPosts(limit: number): Promise<DbPost[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .neq('tag', 'service')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function fetchRecentServices(limit: number): Promise<DbPost[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('tag', 'service')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function fetchRecentSurfPosts(limit: number): Promise<DbPost[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('tag', 'surf')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ---------- MUTATIONS ----------

async function uploadMedia(file: File, deviceId: string): Promise<{ url: string; type: 'image' | 'pdf' }> {
  const supabase = requireSupabase();
  const isImage = file.type.startsWith('image/');
  const mediaType: 'image' | 'pdf' = isImage ? 'image' : 'pdf';

  let fileToUpload = file;
  if (isImage) {
    fileToUpload = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    });
  }

  const ext = file.name.split('.').pop() || (isImage ? 'jpg' : 'pdf');
  const path = `${deviceId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('media')
    .upload(path, fileToUpload, { contentType: fileToUpload.type });

  if (error) throw new Error('File upload failed');

  const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
  return { url: urlData.publicUrl, type: mediaType };
}

export async function createPost(params: {
  title: string;
  body: string;
  tag: Tag;
  serviceType?: ServiceType;
  serviceCategory?: ServiceCategory;
  price?: string;
  contact?: string;
  file?: File;
}): Promise<DbPost> {
  const deviceId = getStoredDeviceId();
  if (!deviceId) throw new Error('Not registered');

  // Rate limit check
  const canPost = await checkRateLimit(deviceId, 'post', 5, 60);
  if (!canPost) throw new Error('You\'re posting too fast. Wait a bit before posting again.');

  const supabase = requireSupabase();
  const { data: device } = await supabase
    .from('devices')
    .select('nickname')
    .eq('id', deviceId)
    .single();

  if (!device) throw new Error('Device not found');

  // Upload media if provided
  let media: { url: string; type: 'image' | 'pdf' } | null = null;
  if (params.file) {
    media = await uploadMedia(params.file, deviceId);
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      device_id: deviceId,
      nickname: device.nickname,
      title: params.title,
      body: params.body,
      tag: params.tag,
      service_type: params.serviceType || null,
      service_category: params.serviceCategory || null,
      price: params.price || null,
      contact: params.contact || null,
      media_url: media?.url || null,
      media_type: media?.type || null,
    })
    .select()
    .single();

  if (error) throw error;

  // Record rate limit
  await supabase.from('rate_limits').insert({
    device_id: deviceId,
    action_type: 'post',
  });

  return data;
}

export async function createComment(postId: string, body: string): Promise<DbComment> {
  const deviceId = getStoredDeviceId();
  if (!deviceId) throw new Error('Not registered');

  const canComment = await checkRateLimit(deviceId, 'comment', 10, 5);
  if (!canComment) throw new Error('Slow down! Wait a moment before commenting again.');

  const supabase = requireSupabase();
  const { data: device } = await supabase
    .from('devices')
    .select('nickname')
    .eq('id', deviceId)
    .single();

  if (!device) throw new Error('Device not found');

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      device_id: deviceId,
      nickname: device.nickname,
      body,
    })
    .select()
    .single();

  if (error) throw error;

  await supabase.from('rate_limits').insert({
    device_id: deviceId,
    action_type: 'comment',
  });

  return data;
}

export async function toggleVote(
  target: { postId: string } | { commentId: string }
): Promise<{ voted: boolean; newCount: number }> {
  const deviceId = getStoredDeviceId();
  if (!deviceId) throw new Error('Not registered');

  const supabase = requireSupabase();
  const isPostVote = 'postId' in target;
  const targetColumn = isPostVote ? 'post_id' : 'comment_id';
  const targetId = isPostVote ? target.postId : target.commentId;

  // Check if vote exists
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('device_id', deviceId)
    .eq(targetColumn, targetId)
    .single();

  if (existingVote) {
    await supabase.from('votes').delete().eq('id', existingVote.id);
    const table = isPostVote ? 'posts' : 'comments';
    const { data } = await supabase.from(table).select('upvote_count').eq('id', targetId).single();
    return { voted: false, newCount: data?.upvote_count ?? 0 };
  } else {
    const insertData: Record<string, string> = { device_id: deviceId };
    insertData[targetColumn] = targetId;
    await supabase.from('votes').insert(insertData);
    const table = isPostVote ? 'posts' : 'comments';
    const { data } = await supabase.from(table).select('upvote_count').eq('id', targetId).single();
    return { voted: true, newCount: data?.upvote_count ?? 0 };
  }
}

export async function fetchReputation(nickname: string): Promise<number> {
  const supabase = requireSupabase();
  const [{ data: postUpvotes }, { data: commentUpvotes }] = await Promise.all([
    supabase.from('posts').select('upvote_count').eq('nickname', nickname),
    supabase.from('comments').select('upvote_count').eq('nickname', nickname),
  ]);

  const postRep = (postUpvotes || []).reduce((sum, p) => sum + p.upvote_count, 0);
  const commentRep = (commentUpvotes || []).reduce((sum, c) => sum + c.upvote_count, 0);
  return postRep + commentRep;
}

async function checkRateLimit(
  deviceId: string,
  action: string,
  maxCount: number,
  windowMinutes: number
): Promise<boolean> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_device_id: deviceId,
    p_action: action,
    p_max_count: maxCount,
    p_window_minutes: windowMinutes,
  });
  if (error) return true; // fail open
  return data as boolean;
}
