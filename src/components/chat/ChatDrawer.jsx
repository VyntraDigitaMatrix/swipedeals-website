import { useState, useEffect, useRef } from 'react'
import {
  AlertCircle, CheckCheck, CornerDownRight, MessageSquare,
  Send, Trash2, User, X,
} from 'lucide-react'
import Button from '../buttons/Button'
import Input from '../forms/Input'
import { useAuth } from '../../hooks/useAuth'
import { useChat } from '../../hooks/useChat'
import { cn } from '../../utils/cn'

export default function ChatDrawer({ isOpen, onClose, recipientId = null, title = 'Chat' }) {
  const { isAuthenticated } = useAuth()
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    messagesLoading,
    sending,
    error,
    fetchConversations,
    startConversationWith,
    sendMessage,
    deleteMessage,
    selectConversation,
  } = useChat(isOpen && isAuthenticated) // Enable autoFetch + polling when drawer is open

  const [text, setText] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const messagesEndRef = useRef(null)
  const prevRecipientRef = useRef(null)

  // Start or switch conversation when drawer opens with a recipientId
  useEffect(() => {
    if (isOpen && isAuthenticated && recipientId) {
      // Only start a new conversation if the recipientId actually changed
      if (prevRecipientRef.current !== recipientId) {
        prevRecipientRef.current = recipientId
        startConversationWith(recipientId).catch(() => { })
      }
    }
    if (!isOpen) {
      prevRecipientRef.current = null
    }
  }, [isOpen, isAuthenticated, recipientId, startConversationWith])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])


  if (!isOpen) return null

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    const content = text.trim()
    const replyId = replyingTo?.id || null
    setText('')
    setReplyingTo(null)
    try {
      await sendMessage(content, replyId)
    } catch (err) {
      setText(content)
    }
  }

  const handleDeleteMsg = async (msgId) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await deleteMessage(msgId)
    } catch (err) {
      alert(`Could not delete message: ${err?.message}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-2xl flex-col bg-surface shadow-2xl sm:border-l sm:border-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">{title}</h2>
              <p className="text-xs text-text-secondary">
                {activeConversation
                  ? `Conversation #${activeConversation.id.slice(0, 8)}`
                  : 'Messages & Inquiry Chat'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-alt hover:text-text"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Conversation List Sidebar */}
          <div className="w-1/3 border-r border-border bg-surface-alt/40 overflow-y-auto hidden sm:block">
            <div className="p-3 border-b border-border font-mono text-[11px] font-bold uppercase tracking-wider text-text-secondary">
              Conversations ({conversations.length})
            </div>

            {loading && <p className="p-4 text-center text-xs text-text-light">Loading chats...</p>}

            {!loading && conversations.length === 0 && (
              <p className="p-4 text-center text-xs text-text-secondary">No conversations yet.</p>
            )}

            {conversations.map((c) => {
              const active = activeConversation?.id === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectConversation(c)}
                  className={cn(
                    'w-full p-3 text-left border-b border-border transition-colors flex items-start gap-2.5',
                    active ? 'bg-surface shadow-sm border-l-4 border-l-primary' : 'hover:bg-surface-alt'
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    <User size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text truncate">
                        {c.participantTwoName || c.participantName || c.participantTwoRole || 'User'}
                      </span>
                      {c.lastMessage?.createdAt && (
                        <span className="font-mono text-[10px] text-text-light">
                          {new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-text-secondary truncate">
                      {c.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Chat Messages Panel */}
          <div className="flex flex-1 flex-col bg-surface">
            {activeConversation ? (
              <>
                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messagesLoading && (
                    <p className="text-center text-xs text-text-light py-4">Loading messages...</p>
                  )}

                  {!messagesLoading && messages.length === 0 && (
                    <div className="py-12 text-center text-xs text-text-secondary">
                      <MessageSquare size={32} className="mx-auto mb-2 text-text-light" />
                      <p className="font-semibold text-text">Start a conversation</p>
                      <p className="mt-1 text-text-light">Send a message below to reach out directly.</p>
                    </div>
                  )}

                  {([...messages].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))).map((m) => {
                    const isSelf = m.senderId === activeConversation.participantOneId || m.senderRole === 'USER'
                    return (
                      <div
                        key={m.id}
                        className={cn('flex flex-col group', isSelf ? 'items-end' : 'items-start')}
                      >
                        {/* Reply Banner if message replies to something */}
                        {m.replyToContent && (
                          <div className="mb-1 flex items-center gap-1 text-[10px] text-text-secondary bg-surface-alt px-2.5 py-1 rounded-md max-w-[80%] border-l-2 border-primary">
                            <CornerDownRight size={10} />
                            <span className="truncate">{m.replyToContent}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 max-w-[85%]">
                          {isSelf && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMsg(m.id)}
                              className="opacity-0 group-hover:opacity-100 text-text-light hover:text-danger p-1 transition-opacity"
                              title="Delete message"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}

                          <div
                            className={cn(
                              'rounded-2xl px-4 py-2.5 text-xs shadow-soft leading-relaxed',
                              isSelf
                                ? 'bg-primary text-white rounded-br-none'
                                : 'bg-surface-alt text-text rounded-bl-none border border-border'
                            )}
                          >
                            <p>{m.content}</p>
                          </div>
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-[10px] text-text-light px-1">
                          {m.createdAt && (
                            <span className="font-mono">
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                          {isSelf && (
                            <CheckCheck size={12} className={m.seen ? 'text-info' : 'text-text-light'} />
                          )}
                          <button
                            type="button"
                            onClick={() => setReplyingTo(m)}
                            className="ml-2 font-semibold hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Indicator Bar */}
                {replyingTo && (
                  <div className="flex items-center justify-between border-t border-border bg-surface-alt/80 px-4 py-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-text-secondary truncate">
                      <CornerDownRight size={12} className="text-primary" />
                      <span className="font-semibold text-text">Replying:</span>
                      <span className="truncate">{replyingTo.content}</span>
                    </div>
                    <button type="button" onClick={() => setReplyingTo(null)} className="text-text-light hover:text-text">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Input Controls */}
                <form onSubmit={handleSend} className="border-t border-border p-3 flex gap-2 items-center bg-surface">
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs text-text focus:border-primary focus:outline-none"
                  />
                  <Button variant="primary" size="sm" type="submit" loading={sending} disabled={!text.trim()}>
                    <Send size={14} />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-xs text-text-secondary">
                <MessageSquare size={36} className="mb-3 text-text-light" />
                <p className="font-bold text-text">Select a conversation</p>
                <p className="mt-1 max-w-xs text-text-light">Pick a thread from the list or start a new chat with a seller.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
