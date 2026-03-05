import { useEffect, useMemo, useRef, useState } from 'react';
import { aiAPI } from '../../services/api';

const OUT_OF_SCOPE_REFUSAL = '이 요청은 현재 도우미 지원 범위를 벗어나서 답변할 수 없습니다.';
const OUT_OF_SCOPE_PIVOT = '대신 개발 Q&A, 사이트 이용법, 글쓰기 보조 중에서 어떤 도움을 원하시나요?';
const INITIAL_ASSISTANT_MESSAGE = '안녕하세요. 개발 질문, 사이트 이용 문의를 도와드릴 수 있어요. 필요한 내용을 입력해 주세요.';

const createMessage = (role, content, extra = {}) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  ...extra,
});

function SidebarChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState(() => ([
    createMessage(
      'assistant',
      INITIAL_ASSISTANT_MESSAGE,
    ),
  ]));
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const hasUnread = useMemo(
    () => !isOpen && messages.length > 1,
    [isOpen, messages.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, isOpen]);

  const handleResetConversation = () => {
    if (isSending) return;
    setMessages([
      createMessage('assistant', INITIAL_ASSISTANT_MESSAGE),
    ]);
    setInput('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSending) return;
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const response = await aiAPI.chat({
        source: 'sidebar_chat',
        message: trimmed,
      });
      const data = response?.data || {};
      if (data.intent === 'OUT_OF_SCOPE') {
        setMessages((prev) => [
          ...prev,
          createMessage('out_of_scope', OUT_OF_SCOPE_REFUSAL, {
            suggestedQuestion: OUT_OF_SCOPE_PIVOT,
          }),
        ]);
        return;
      }
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', data.answer || '답변을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.'),
      ]);
    } catch (error) {
      const detail = error?.response?.data?.detail || '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      setMessages((prev) => [
        ...prev,
        createMessage('error', detail),
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed right-5 bottom-5 sm:right-6 sm:bottom-6 z-40 inline-flex items-center gap-2 rounded-full border border-ink-900 bg-ink-950 px-4 py-3 text-xs font-semibold text-paper-50 shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
        aria-label={isOpen ? 'AI 채팅 닫기' : 'AI 채팅 열기'}
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-paper-50 text-ink-900 text-[10px] font-black">
          AI
        </span>
        <span>{isOpen ? '닫기' : '도움받기'}</span>
        {hasUnread && !isOpen && (
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <section className="fixed right-4 left-4 sm:left-auto sm:right-6 bottom-20 sm:w-[360px] z-40 rounded-2xl border border-ink-200 bg-white shadow-2xl overflow-hidden animate-fade-up">
          <header className="px-4 py-3 border-b border-ink-100 bg-paper-50 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-900">AI 도우미</p>
              <p className="text-[11px] text-ink-500">수동 전송 시에만 요청됩니다.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetConversation}
                disabled={isSending}
                className="h-8 px-2.5 rounded-md border border-ink-200 bg-white text-[11px] font-medium text-ink-700 hover:bg-paper-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                새 대화
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-ink-500 hover:text-ink-800"
                aria-label="채팅 닫기"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          <div ref={listRef} className="h-[340px] overflow-y-auto px-3 py-3 space-y-2.5 bg-white">
            {messages.map((message) => {
              if (message.role === 'out_of_scope') {
                return (
                  <article key={message.id} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                    <p className="text-xs font-semibold text-amber-800">지원 범위 밖 요청</p>
                    <p className="mt-1 text-sm text-amber-900">{OUT_OF_SCOPE_REFUSAL}</p>
                    <p className="mt-1.5 text-xs text-amber-800">전환 질문: {OUT_OF_SCOPE_PIVOT}</p>
                  </article>
                );
              }

              const isUser = message.role === 'user';
              const isError = message.role === 'error';
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-ink-900 text-paper-50'
                        : isError
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-paper-100 text-ink-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3 py-2 text-sm bg-paper-100 text-ink-600">
                  답변 생성 중...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-ink-100 bg-paper-50">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="질문을 입력하세요"
                className="input-field !py-2.5 !text-sm"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="btn-accent !px-3 !py-2.5 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}

export default SidebarChatWidget;
