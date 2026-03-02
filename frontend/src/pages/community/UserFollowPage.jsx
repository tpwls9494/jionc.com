import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { followsAPI } from '../../services/api';
import { useConfirm } from '../../components/ConfirmModal';
import useAuthStore from '../../stores/authStore';
import { getAvatarInitial, resolveProfileImageUrl } from '../../utils/userProfile';
import { useSeo } from '../../utils/seo';

const PAGE_SIZE = 20;

function UserFollowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const { userId } = useParams();
  const parsedUserId = Number(userId);
  const activeTab = location.pathname.endsWith('/following') ? 'following' : 'followers';
  const [page, setPage] = useState(1);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    setPage(1);
  }, [activeTab, parsedUserId]);

  useSeo({
    title: activeTab === 'followers' ? '팔로워 목록' : '팔로잉 목록',
    description: '사용자 팔로우 관계를 확인할 수 있는 페이지',
    url: `/users/${parsedUserId}/${activeTab}`,
    noindex: true,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['follow-user-list', activeTab, parsedUserId, page],
    queryFn: () => (
      activeTab === 'followers'
        ? followsAPI.getFollowers(parsedUserId, page, PAGE_SIZE)
        : followsAPI.getFollowing(parsedUserId, page, PAGE_SIZE)
    ),
    enabled: Number.isFinite(parsedUserId) && parsedUserId > 0,
  });

  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isMine = currentUser?.id === parsedUserId;
  const canManageFollowers = isMine && activeTab === 'followers';

  const removeFollowerMutation = useMutation({
    mutationFn: (targetUserId) => followsAPI.removeFollower(targetUserId),
    onSuccess: () => {
      toast.success('팔로워를 삭제했습니다.');
      queryClient.invalidateQueries(['follow-user-list']);
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || '팔로워 삭제에 실패했습니다.');
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: (targetUserId) => followsAPI.blockUser(targetUserId),
    onSuccess: () => {
      toast.success('사용자를 차단했습니다.');
      queryClient.invalidateQueries(['follow-user-list']);
      queryClient.invalidateQueries(['follow-status']);
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || '사용자 차단에 실패했습니다.');
    },
  });
  const heading = useMemo(() => {
    if (isMine) {
      return activeTab === 'followers' ? '내 팔로워' : '내 팔로잉';
    }
    return activeTab === 'followers' ? `사용자 #${parsedUserId}의 팔로워` : `사용자 #${parsedUserId}의 팔로잉`;
  }, [activeTab, isMine, parsedUserId]);

  if (!Number.isFinite(parsedUserId) || parsedUserId <= 0) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-up">
        <section className="card p-8 text-center">
          <p className="text-sm text-ink-500">잘못된 사용자 경로입니다.</p>
        </section>
      </div>
    );
  }

  const handleRemoveFollower = async (targetUserId, username) => {
    const ok = await confirm({
      title: '팔로워 삭제',
      message: `${username} 님을 팔로워에서 삭제하시겠습니까?`,
      confirmText: '삭제',
    });
    if (!ok) return;
    removeFollowerMutation.mutate(targetUserId);
  };

  const handleBlockFollower = async (targetUserId, username) => {
    const ok = await confirm({
      title: '사용자 차단',
      message: `${username} 님을 차단하시겠습니까? 서로 팔로우 관계가 해제됩니다.`,
      confirmText: '차단',
    });
    if (!ok) return;
    blockUserMutation.mutate(targetUserId);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-5 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        이전으로
      </button>

      <section className="card p-5 sm:p-6">
        <h1 className="font-display text-2xl font-bold text-ink-950 tracking-tight">{heading}</h1>
        <p className="mt-1 text-xs text-ink-500">
          {activeTab === 'followers'
            ? '이 사용자를 팔로우하는 계정 목록입니다.'
            : '이 사용자가 팔로우하는 계정 목록입니다.'}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/users/${parsedUserId}/followers`)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeTab === 'followers'
                ? 'bg-ink-900 text-paper-50 border-ink-900'
                : 'bg-white text-ink-600 border-ink-200 hover:bg-paper-100'
            }`}
          >
            팔로워
          </button>
          <button
            type="button"
            onClick={() => navigate(`/users/${parsedUserId}/following`)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeTab === 'following'
                ? 'bg-ink-900 text-paper-50 border-ink-900'
                : 'bg-white text-ink-600 border-ink-200 hover:bg-paper-100'
            }`}
          >
            팔로잉
          </button>
          <span className="ml-auto text-xs text-ink-400">총 {total}명</span>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 gap-2">
              <div className="w-6 h-6 border-2 border-ink-200 border-t-ink-600 rounded-full animate-spin" />
              <p className="text-sm text-ink-400">목록을 불러오는 중입니다.</p>
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-ink-200 bg-paper-50 px-4 py-8 text-center text-sm text-ink-500">
              목록을 불러오지 못했습니다.
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-xl border border-ink-200 bg-paper-50 px-4 py-8 text-center text-sm text-ink-500">
              {activeTab === 'followers'
                ? '아직 팔로워가 없습니다.'
                : '아직 팔로잉한 사용자가 없습니다.'}
            </div>
          ) : (
            <ul className="space-y-2">
              {users.map((item) => {
                const avatarUrl = resolveProfileImageUrl(item.profile_image_url);
                return (
                  <li key={`${activeTab}-${item.user_id}`} className="rounded-xl border border-ink-100 bg-paper-50 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        to={`/users/${item.user_id}/followers`}
                        className="min-w-0 flex-1 flex items-center gap-3 hover:opacity-85 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-full bg-ink-200 overflow-hidden flex items-center justify-center shrink-0">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={`${item.username} 프로필`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-ink-600">
                              {getAvatarInitial(item.username)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink-800 truncate">
                            {item.username}
                          </p>
                          <p className="text-xs text-ink-400">
                            {new Intl.DateTimeFormat('ko-KR', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            }).format(new Date(item.followed_at))}
                          </p>
                        </div>
                      </Link>

                      {canManageFollowers && item.user_id !== currentUser?.id && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveFollower(item.user_id, item.username)}
                            disabled={removeFollowerMutation.isPending || blockUserMutation.isPending}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-ink-200 bg-white text-ink-600 hover:bg-paper-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            삭제
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBlockFollower(item.user_id, item.username)}
                            disabled={removeFollowerMutation.isPending || blockUserMutation.isPending}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            차단
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="btn-ghost text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="text-sm text-ink-500">{page} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="btn-ghost text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default UserFollowPage;
