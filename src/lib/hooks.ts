import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  fetchPosts,
  fetchServices,
  fetchPost,
  fetchComments,
  fetchRecentPosts,
  fetchRecentServices,
  fetchRecentSurfPosts,
  createPost,
  createComment,
  toggleVote,
  fetchReputation,
  type DbComment,
} from './api';
import type { Tag, ServiceType, ServiceCategory } from './store';

// ---------- QUERY KEYS ----------

export const queryKeys = {
  posts: (sort: string, tag?: Tag) => ['posts', sort, tag] as const,
  services: (mode?: ServiceType, cat?: ServiceCategory) => ['services', mode, cat] as const,
  post: (id: string) => ['post', id] as const,
  comments: (postId: string) => ['comments', postId] as const,
  reputation: (nickname: string) => ['reputation', nickname] as const,
  recentPosts: ['recentPosts'] as const,
  recentServices: ['recentServices'] as const,
  recentSurfPosts: ['recentSurfPosts'] as const,
};

// ---------- POSTS (infinite scroll) ----------

export function usePostsInfinite(sort: 'new' | 'hot', tag?: Tag) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts(sort, tag),
    queryFn: ({ pageParam = 0 }) => fetchPosts({ sort, tag, page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 30_000,
  });
}

// ---------- SERVICES (infinite scroll) ----------

export function useServicesInfinite(mode?: ServiceType, category?: ServiceCategory) {
  return useInfiniteQuery({
    queryKey: queryKeys.services(mode, category),
    queryFn: ({ pageParam = 0 }) => fetchServices({ mode, category, page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length : undefined,
    initialPageParam: 0,
    staleTime: 30_000,
  });
}

// ---------- SINGLE POST ----------

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.post(id),
    queryFn: () => fetchPost(id),
    staleTime: 15_000,
  });
}

// ---------- COMMENTS ----------

export function useComments(postId: string) {
  return useQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: () => fetchComments(postId),
    staleTime: 10_000,
  });
}

// ---------- REPUTATION ----------

export function useReputation(nickname: string | null) {
  return useQuery({
    queryKey: queryKeys.reputation(nickname || ''),
    queryFn: () => fetchReputation(nickname!),
    enabled: !!nickname,
    staleTime: 60_000,
  });
}

// ---------- HOME PAGE ----------

export function useRecentPosts() {
  return useQuery({
    queryKey: queryKeys.recentPosts,
    queryFn: () => fetchRecentPosts(3),
    staleTime: 30_000,
  });
}

export function useRecentServices() {
  return useQuery({
    queryKey: queryKeys.recentServices,
    queryFn: () => fetchRecentServices(3),
    staleTime: 30_000,
  });
}

export function useRecentSurfPosts() {
  return useQuery({
    queryKey: queryKeys.recentSurfPosts,
    queryFn: () => fetchRecentSurfPosts(3),
    staleTime: 30_000,
  });
}

// ---------- MUTATIONS ----------

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentPosts });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentServices });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentSurfPosts });
    },
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => createComment(postId, body),
    onMutate: async (body) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.comments(postId) });
      const previous = queryClient.getQueryData<DbComment[]>(queryKeys.comments(postId));
      queryClient.setQueryData<DbComment[]>(queryKeys.comments(postId), (old) => [
        ...(old || []),
        {
          id: 'optimistic-' + Date.now(),
          post_id: postId,
          device_id: '',
          nickname: '...',
          body,
          upvote_count: 0,
          created_at: new Date().toISOString(),
          has_voted: false,
        },
      ]);
      return { previous };
    },
    onError: (_err, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.comments(postId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
    },
  });
}

export function useToggleVote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleVote,
    onSuccess: (_data, variables) => {
      if ('postId' in variables) {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: queryKeys.post(variables.postId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.recentPosts });
      } else {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      }
    },
  });
}
