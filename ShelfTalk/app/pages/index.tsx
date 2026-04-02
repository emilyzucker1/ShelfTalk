import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import { getPublicPosts } from '../backend/get_post';
// import { getFollowingPosts } from '../backend/get_post';
import { auth, db } from '../firebase';
import { toggleLike } from '../backend/likes';
import { createComment, getComments, deleteComment } from '../backend/comments';
import { collection, doc, getCountFromServer, getDoc } from 'firebase/firestore';
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

type Comment = {
  id: string;
  text: string;
  authorId: string;
  authorName?: string;
  createdAt?: any;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mapPostToFeedItem = (post: any, liked = false, followingIds: string[] = [], commentCount = 0): Post => ({
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
  likes: post?.likeCount ?? 0,
  comments: commentCount,
  liked,
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
  onOpenComments,
  commentCount,
}: {
  post: Post;
  index: number;
  tab: 'following' | 'explore';
  onToggleLike: (id: string) => void;
  onFollow: (id: string) => void;
  onOpenComments: (id: string) => void;
  commentCount: number;
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
        <Pressable style={cardStyles.actionBtn} onPress={() => onOpenComments(post.id)}>
          <FontAwesome name="comment-o" size={15} color="#2e3a35" />
          <Text style={cardStyles.actionText}>{commentCount} comments</Text>
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

// ─── Comment Modal ────────────────────────────────────────────────────────────

function CommentModal({
  visible,
  postId,
  comments,
  loading,
  input,
  submitting,
  currentUserId,
  onClose,
  onChangeInput,
  onSubmit,
  onDeleteComment,
}: {
  visible: boolean;
  postId: string | null;
  comments: Comment[];
  loading: boolean;
  input: string;
  submitting: boolean;
  currentUserId: string | undefined;
  onClose: () => void;
  onChangeInput: (text: string) => void;
  onSubmit: () => void;
  onDeleteComment: (commentId: string, postId: string) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={cmtStyles.overlay} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={cmtStyles.sheet}
      >
        {/* Header */}
        <View style={cmtStyles.sheetHeader}>
          <Text style={cmtStyles.sheetTitle}>Comments</Text>
          <Pressable onPress={onClose} style={cmtStyles.closeBtn}>
            <Feather name="x" size={20} color="#748B97" />
          </Pressable>
        </View>

        {/* List */}
        {loading ? (
          <View style={cmtStyles.centeredRow}>
            <ActivityIndicator size="small" color="#90B8A8" />
          </View>
        ) : comments.length === 0 ? (
          <View style={cmtStyles.centeredRow}>
            <Text style={cmtStyles.emptyText}>No comments yet. Be the first!</Text>
          </View>
        ) : (
          <ScrollView style={cmtStyles.list} keyboardShouldPersistTaps="handled">
            {comments.map(c => (
              <View key={c.id} style={cmtStyles.commentRow}>
                <AvatarPlaceholder name={c.authorName ?? 'User'} size={32} />
                <View style={cmtStyles.bubble}>
                  <Text style={cmtStyles.commentAuthor}>{c.authorName ?? 'User'}</Text>
                  <Text style={cmtStyles.commentText}>{c.text}</Text>
                </View>
                {currentUserId && c.authorId === currentUserId && postId && (
                  <Pressable
                    style={cmtStyles.deleteBtn}
                    onPress={() => onDeleteComment(c.id, postId)}
                  >
                    <Feather name="trash-2" size={14} color="#E63946" />
                  </Pressable>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        {/* Input */}
        <View style={cmtStyles.inputRow}>
          <TextInput
            style={cmtStyles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#748B97"
            value={input}
            onChangeText={onChangeInput}
            multiline
          />
          <Pressable
            style={[cmtStyles.sendBtn, (!input.trim() || submitting) && cmtStyles.sendBtnDisabled]}
            onPress={onSubmit}
            disabled={!input.trim() || submitting}
          >
            {submitting
              ? <ActivityIndicator size="small" color="#fff" />
              : <Feather name="send" size={16} color="#fff" />}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const cmtStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f0ec',
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#1a2a24' },
  closeBtn: { padding: 4 },
  centeredRow: { paddingVertical: 30, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#748B97' },
  list: { flexGrow: 1, paddingHorizontal: 14, paddingTop: 8, maxHeight: 320 },
  commentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  bubble: { flex: 1, backgroundColor: '#f0f7f4', borderRadius: 12, padding: 10 },
  commentAuthor: { fontSize: 12, fontWeight: '700', color: '#1a2a24', marginBottom: 3 },
  commentText: { fontSize: 13, color: '#2e3a35', lineHeight: 18 },
  deleteBtn: { padding: 6, marginTop: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e8f0ec',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f7f4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1a2a24',
    maxHeight: 80,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#90B8A8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#c9ddd5' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [tab, setTab] = useState<'following' | 'explore'>('following');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<{ [key: string]: Comment[] }>({});
  const [commentInput, setCommentInput] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const currentUserId = auth.currentUser?.uid;
      const raw = await getPublicPosts();
      const sortedRaw = sortPostsByCreatedAt(raw ?? []);

      let likedStates: boolean[] = sortedRaw.map(() => false);
      if (currentUserId) {
        likedStates = await Promise.all(
          sortedRaw.map(post =>
            getDoc(doc(db, 'posts', post.id, 'likes', currentUserId))
              .then(snap => snap.exists())
              .catch(() => false)
          )
        );
      }

      const commentCounts = await Promise.all(
        sortedRaw.map(post =>
          getCountFromServer(collection(db, 'posts', post.id, 'comments'))
            .then(snap => snap.data().count)
            .catch(() => 0)
        )
      );

      setPosts(sortedRaw.map((p, i) => mapPostToFeedItem(p, likedStates[i], [], commentCounts[i])));
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

  const handleToggleLike = async (id: string) => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;

    // Optimistic update
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );

    try {
      await toggleLike(id, currentUserId);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert optimistic update on failure
      setPosts(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
            : p
        )
      );
    }
  };

  const handleFollow = (id: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, isFollowing: !p.isFollowing } : p))
    );
    // TODO: persist to backend
  };

  const handleOpenComments = async (postId: string) => {
    setCommentPostId(postId);
    setCommentsLoading(true);
    try {
      const fetched = await getComments(postId);
      setCommentsMap(prev => ({ ...prev, [postId]: (fetched ?? []) as Comment[] }));
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCloseComments = () => {
    setCommentPostId(null);
    setCommentInput('');
  };

  const handleSubmitComment = async () => {
    const currentUser = auth.currentUser;
    const pid = commentPostId;
    if (!currentUser || !pid || !commentInput.trim()) return;
    setSubmittingComment(true);
    try {
      await createComment(pid, commentInput.trim(), currentUser.uid, currentUser.displayName ?? 'Reader');
      setCommentInput('');
      const updated = await getComments(pid);
      setCommentsMap(prev => ({ ...prev, [pid]: (updated ?? []) as Comment[] }));
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    try {
      await deleteComment(commentId, postId);
      const updated = await getComments(postId);
      setCommentsMap(prev => ({ ...prev, [postId]: (updated ?? []) as Comment[] }));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
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
                  onOpenComments={handleOpenComments}
                  commentCount={(commentsMap[post.id] || []).length || post.comments}
                />
              ))
            )}
          </ScrollView>
        )}
      </View>
      <CommentModal
        visible={commentPostId !== null}
        postId={commentPostId}
        comments={commentPostId ? (commentsMap[commentPostId] ?? []) : []}
        loading={commentsLoading}
        input={commentInput}
        submitting={submittingComment}
        currentUserId={auth.currentUser?.uid}
        onClose={handleCloseComments}
        onChangeInput={setCommentInput}
        onSubmit={handleSubmitComment}
        onDeleteComment={handleDeleteComment}
      />
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