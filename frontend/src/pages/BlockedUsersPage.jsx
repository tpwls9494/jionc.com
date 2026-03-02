import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useConfirm } from '../components/ConfirmModal';
import { followsAPI } from '../services/api';
import { getAvatarInitial, resolveProfileImageUrl } from '../utils/userProfile';
import { useSeo } from '../utils/seo';

const PAGE_SIZE = 30;

function BlockedUsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  useSeo({
    title: '차단 관리',
    description: '차단한 사용자 목록을 확인하고 차단을 해제할 수 있는 페이지',
    url: '/mypage/blocks',
    noindex: true,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-block-users'],
    queryFn: () => followsAPI.getMyBlocks(1, PAGE_SIZE),
  });

  const unblockMutation = useMutation({
    mutationFn: (targetUserId) => followsAPI.unblockUser(targetUserId),
    onSuccess: () => {
      toast.success('차단을 해제했습니다.');
      queryClient.invalidateQueries(['my-block-users']);
      queryClient.invalidateQueries(['follow-status']);
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || '차단 해제에 실패했습니다.');
    },
  });

  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;

  const handleUnblock = async (targetUserId, username) => {
    const ok = await confirm({
      title: '차단 해제',
      message: `${username} 님의 차단을 해제하시겠습니까?`,
      confirmText: '해제',
    });
    if (!ok) return;
    unblockMutation.mutate(targetUserId);
  };

  return (
    <section className="max-w-4xl mx-auto animate-fade-up">
      <button
        type="button"
        onClick={() => navigate('/mypage')}
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-5 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        마이페이지로
      </button>

      <article className="card p-6 md:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-950 tracking-tight">차단 관리</h1>
            <p className="mt-1 text-sm text-ink-500">차단한 사용자 목록과 해제 기능을 제공합니다.</p>
          </div>
          <span className="text-xs text-ink-400 mt-1">총 {total}명</span>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 gap-2">
              <div className="w-6 h-6 border-2 border-ink-200 border-t-ink-600 rounded-full animate-spin" />
              <p className="text-sm text-ink-400">목록을 불러오는 중입니다.</p>
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-ink-200 bg-paper-50 px-4 py-8 text-center text-sm text-ink-500">
              차단 목록을 불러오지 못했습니다.
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-xl border border-ink-200 bg-paper-50 px-4 py-8 text-center text-sm text-ink-500">
              차단한 사용자가 없습니다.
            </div>
          ) : (
            <ul className="space-y-2">
              {users.map((item) => {
                const avatarUrl = resolveProfileImageUrl(item.profile_image_url);
                return (
                  <li
                    key={`block-${item.user_id}`}
                    className="rounded-xl border border-ink-100 bg-paper-50 px-3 py-2.5"
                  >
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
                          <p className="text-sm font-semibold text-ink-800 truncate">{item.username}</p>
                          <p className="text-xs text-ink-400">
                            {new Intl.DateTimeFormat('ko-KR', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            }).format(new Date(item.blocked_at))}
                          </p>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleUnblock(item.user_id, item.username)}
                        disabled={unblockMutation.isPending}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-ink-200 bg-white text-ink-600 hover:bg-paper-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        차단 해제
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </article>
    </section>
  );
}

export default BlockedUsersPage;
