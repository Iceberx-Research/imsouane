import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Services from './pages/Services';
import PostDetail from './pages/PostDetail';
import NewPost from './pages/NewPost';
import NicknameModal from './components/NicknameModal';
import { NicknameProvider, useNickname } from './lib/nickname';
import { useRealtimeSubscriptions } from './lib/realtime';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  const { showModal } = useNickname();
  useRealtimeSubscriptions();

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="feed" element={<Feed />} />
            <Route path="services" element={<Services />} />
            <Route path="post/:id" element={<PostDetail />} />
            <Route path="new" element={<NewPost />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {showModal && <NicknameModal />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NicknameProvider>
        <AppRoutes />
      </NicknameProvider>
    </QueryClientProvider>
  );
}

export default App;
