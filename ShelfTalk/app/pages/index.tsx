import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { getPublicPosts } from '../backend/get_post';
// import { getFollowingPosts } from '../backend/get_post';
import { userID } from '../firebase';
import AntDesign from '@expo/vector-icons/AntDesign';

// ─── Types ────────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  userId?: string;
  username: string;
  userAvatar?: string | null;
  book: string;
  entry: string;        // the journaling prompt / question
  entryBody: string;    // the written answer body
  date: string;
  image: string | null;
  likes: number;
  comments: number;
  liked: boolean;
  isFollowing: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mapPostToFeedItem = (post: any, followingIds: string[] = []): Post => ({
  id: post?.id ?? Math.random().toString(),
  userId: post?.authorId,
  username: post?.username ?? 'Reader',
  userAvatar: post?.userAvatar ?? null,
  book: post?.book ?? post?.title ?? 'Untitled',
  entry: post?.question ?? post?.prompt ?? post?.title ?? '',
  entryBody: post?.text ?? '',
  date: post?.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString()
    : '',
  image: post?.image ?? null,
  likes: post?.likes ?? 0,
  comments: post?.comments ?? 0,
  liked: post?.likedBy?.includes(userID) ?? false,
  isFollowing: followingIds.includes(post?.authorId),
});

const sortPostsByCreatedAt = (posts: any[]) => {
  return [...posts].sort((a, b) => {
    const aMs = a?.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
    const bMs = b?.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
    return bMs - aMs;
  });
};

const COVER_COLORS = ['#d4907a', '#90B8A8', '#a890b8', '#909ab8', '#b8a890'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvatarPlaceholder({ name, size = 44 }: { name: string; size?: number }) {
  const initial = name?.[0]?.toUpperCase() ?? '?';
  const colors = ['#d4907a', '#90B8A8', '#b89090', '#90a8b8', '#a890b8'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: 'white', fontWeight: '700', fontSize: size * 0.38 }}>{initial}</Text>
    </View>
  );
}

function BookCover({ title, index }: { title: string; index: number }) {
  const bg = COVER_COLORS[index % COVER_COLORS.length];
  return (
    <View style={[coverStyles.container, { backgroundColor: bg }]}>
      <Text style={coverStyles.title}>{title}</Text>
    </View>
  );
}

const coverStyles = StyleSheet.create({
  container: {
    width: 190,
    height: 230,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
 title: {
  fontFamily: 'Inter_700Bold',
  fontSize: 18,
  color: 'rgba(255,255,255,0.95)',
  textAlign: 'center',
  textShadowColor: 'rgba(0,0,0,0.2)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 4,
  lineHeight: 26,
},
});

function PostCard({
  post,
  index,
  tab,
  onToggleLike,
  onFollow,
}: {
  post: Post;
  index: number;
  tab: 'following' | 'explore';
  onToggleLike: (id: string) => void;
  onFollow: (id: string) => void;
}) {
  return (
    <View style={cardStyles.card}>
      {/* ── Header ── */}
      <View style={cardStyles.header}>
        {post.userAvatar ? (
          <Image source={{ uri: post.userAvatar }} style={cardStyles.avatarImg} />
        ) : (
          <AvatarPlaceholder name={post.username} />
        )}

        <View style={cardStyles.metaCol}>
          <View style={cardStyles.nameRow}>
            <Text style={cardStyles.name}>{post.username}</Text>
          </View>
          <Text style={cardStyles.date}>{post.date}</Text>
        </View>

        {tab === 'explore' && (
          <Pressable
            style={[cardStyles.followBtn, post.isFollowing && cardStyles.followingBtn]}
            onPress={() => onFollow(post.id)}
          >
            <Text style={[cardStyles.followText, post.isFollowing && cardStyles.followingText]}>
              {post.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        )}

        <Pressable style={cardStyles.moreBtn}>
          <Text style={cardStyles.moreDots}>···</Text>
        </Pressable>
      </View>

      {/* ── Book cover image (left-aligned, like mockup) ── */}
      <View style={cardStyles.coverRow}>
        {post.image ? (
          <Image source={{ uri: post.image }} style={cardStyles.coverImg} resizeMode="cover" />
        ) : (
          <BookCover title={post.book} index={index} />
        )}
      </View>

      {/* ── Entry body ── */}
      <View style={cardStyles.body}>
        <Text style={cardStyles.discussionLabel}>Discussion Questions:</Text>

        {/* Bold question */}
        {post.entry ? (
          <Text style={cardStyles.questionText}>{post.entry}</Text>
        ) : null}

        {/* Answer body */}
        <Text style={cardStyles.bodyText}>
          {post.entryBody || 'No entry written yet.'}
        </Text>
      </View>

      {/* ── Footer ── */}
      <View style={cardStyles.footer}>
        <Pressable style={cardStyles.actionBtn} onPress={() => onToggleLike(post.id)}>
          <AntDesign name={post.liked ? 'heart' : 'heart'}size={16} color={post.liked ? '#E63946' : '#2e3a35'}/>
          <Text style={[cardStyles.actionText, post.liked && { color: '#F4A896' }]}>
            {post.likes} likes
          </Text>
        </Pressable>
        <Pressable style={cardStyles.actionBtn}>
          <FontAwesome name="comment-o" size={15} color="#2e3a35" />
          <Text style={cardStyles.actionText}>{post.comments} comments</Text>
        </Pressable>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#E6F2F0',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#d0e6de',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  avatarImg: { width: 44, height: 44, borderRadius: 22 },
  metaCol: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 14, fontWeight: '700', color: '#1a2a24' },
  date: { fontSize: 11, color: '#748B97', marginTop: 1 },
  followBtn: {
    backgroundColor: '#90B8A8',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  followingBtn: { backgroundColor: '#c9ddd5' },
  followText: { fontSize: 12, fontWeight: '700', color: '#ffffff' },
  followingText: { color: '#748B97' },
  moreBtn: { padding: 4 },
  moreDots: { fontSize: 18, color: '#748B97', letterSpacing: 1 },
  // Cover left-aligned like the mockup
  coverRow: {
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  coverImg: {
    width: 190,
    height: 230,
    borderRadius: 10,
  },
  body: { paddingHorizontal: 14, paddingBottom: 8 },
  discussionLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#1a2a24',
    marginBottom: 6,
  },
  questionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a2a24',
    lineHeight: 20,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 13,
    color: '#1a2a24',
    lineHeight: 20,
    fontWeight: '400',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 20,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13, color: '#1a2a24', fontWeight: '400' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [tab, setTab] = useState<'following' | 'explore'>('following');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const raw = await getPublicPosts();
      const sortedRaw = sortPostsByCreatedAt(raw ?? []);
      setPosts(sortedRaw.map(p => mapPostToFeedItem(p)));
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  useEffect(() => { loadPosts(); }, [tab]);

  const handleToggleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    // TODO: persist to backend
  };

  const handleFollow = (id: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, isFollowing: !p.isFollowing } : p))
    );
    // TODO: persist to backend
  };

  return (
    <View style={styles.pageWrapper}>
      <View style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>

        {/* ── Following / Explore tabs ── */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tab, tab === 'following' && styles.tabActive]}
            onPress={() => setTab('following')}
          >
            <Text style={[styles.tabText, tab === 'following' && styles.tabTextActive]}>
              Following
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, tab === 'explore' && styles.tabActive]}
            onPress={() => setTab('explore')}
          >
            <View style={styles.exploreInner}>
              <Feather
                name="compass"
                size={16}
                color={tab === 'explore' ? '#2e3a35' : '#748B97'}
              />
              <Text style={[styles.tabText, tab === 'explore' && styles.tabTextActive]}>
                Explore
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ── Feed ── */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#90B8A8" />
          </View>
        ) : (
          <ScrollView
            style={styles.feed}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#90B8A8" />
            }
          >
            {posts.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="book-open" size={40} color="#c9ddd5" />
                <Text style={styles.emptyText}>
                  {tab === 'following'
                    ? 'Follow readers to see their entries here.'
                    : 'No public entries yet.'}
                </Text>
              </View>
            ) : (
              posts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  tab={tab}
                  onToggleLike={handleToggleLike}
                  onFollow={handleFollow}
                />
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    width: '100%',
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    backgroundColor: '#E6F2F0',
  },
  container: {
    width: Platform.OS === 'web' ? 500 : '100%',
    flex: 1,
    backgroundColor: '#E6F2F0',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 4,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
headerTitle: {
  fontFamily: 'Inter_700Bold',
  fontSize: 28,
  color: '#1a2a24',
  letterSpacing: 0.3,
},
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#c0d8d0',
    marginBottom: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#1a2a24' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#748B97' },
  tabTextActive: { color: '#1a2a24' },
  exploreInner: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  feed: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 14 },
  emptyText: { fontSize: 14, color: '#748B97', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },
});