import { useState, useCallback, useEffect, useRef } from 'react'
import { chatService } from '../services/chatService'

const POLL_INTERVAL_MS = 3000 // Poll every 3 seconds for new messages

export function useChat(autoFetch = false) {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  // Ref to track the active conversation id for polling without re-creating intervals
  const activeConvIdRef = useRef(null)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await chatService.getConversations()
      const list = Array.isArray(data) ? data : data?.data || data?.content || []
      setConversations(list)
      return list
    } catch (err) {
      if (err?.response?.status !== 401) {
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch conversations.'
        setError(errMsg)
      }
      setConversations([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Silent poll for messages — doesn't touch loading state so the UI stays smooth
  const pollMessages = useCallback(async (conversationId) => {
    if (!conversationId) return
    try {
      const data = await chatService.getMessages(conversationId)
      const pageContent = data?.content || data?.data?.content || (Array.isArray(data) ? data : [])
      const sortedMessages = Array.isArray(pageContent)
        ? [...pageContent].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
        : []
      setMessages(sortedMessages)
      // Mark as seen silently
      chatService.markAsSeen(conversationId).catch(() => {})
    } catch {
      // Silently ignore poll errors to avoid spamming the UI
    }
  }, [])

  const fetchMessages = useCallback(async (conversationId, params = {}) => {
    if (!conversationId) return
    setMessagesLoading(true)
    setError(null)
    try {
      const data = await chatService.getMessages(conversationId, params)
      const pageContent = data?.content || data?.data?.content || (Array.isArray(data) ? data : [])
      const sortedMessages = Array.isArray(pageContent)
        ? [...pageContent].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
        : []
      setMessages(sortedMessages)
      // Mark as seen silently
      chatService.markAsSeen(conversationId).catch(() => {})
      return pageContent
    } catch (err) {
      if (err?.response?.status !== 401 && err?.response?.status !== 404) {
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch messages.'
        setError(errMsg)
      }
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }, [])

  const startConversationWith = useCallback(async (recipientId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await chatService.startConversation(recipientId)
      const conv = data?.data || data
      if (conv?.id) {
        setActiveConversation(conv)
        setConversations((prev) => {
          const exists = prev.some((c) => c.id === conv.id)
          return exists ? prev.map((c) => (c.id === conv.id ? conv : c)) : [conv, ...prev]
        })
        await fetchMessages(conv.id)
      }
      return conv
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to start conversation.'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchMessages])

  const sendMessage = useCallback(async (content, replyToMessageId = null) => {
    if (!activeConversation?.id || !content.trim()) return
    setSending(true)
    setError(null)
    try {
      const res = await chatService.sendMessage(activeConversation.id, {
        content: content.trim(),
        replyToMessageId,
      })
      const newMsg = res?.data || res
      setMessages((prev) => [...prev, newMsg])
      // Update last message in active conversation
      setActiveConversation((prev) => (prev ? { ...prev, lastMessage: newMsg } : prev))
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConversation.id ? { ...c, lastMessage: newMsg } : c))
      )
      return newMsg
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to send message.'
      setError(errMsg)
      throw err
    } finally {
      setSending(false)
    }
  }, [activeConversation])

  const deleteMessage = useCallback(async (messageId) => {
    if (!messageId) return
    setError(null)
    try {
      await chatService.deleteMessage(messageId)
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
      return true
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete message.'
      setError(errMsg)
      throw err
    }
  }, [])

  const selectConversation = useCallback((conv) => {
    setActiveConversation(conv)
    if (conv?.id) {
      fetchMessages(conv.id)
    } else {
      setMessages([])
    }
  }, [fetchMessages])

  useEffect(() => {
    if (autoFetch) {
      fetchConversations()
    }
  }, [autoFetch, fetchConversations])

  // --- Polling: re-fetch messages every POLL_INTERVAL_MS for the active conversation ---
  useEffect(() => {
    activeConvIdRef.current = activeConversation?.id || null
  }, [activeConversation])

  useEffect(() => {
    if (!activeConversation?.id) return

    const intervalId = setInterval(() => {
      const convId = activeConvIdRef.current
      if (convId) {
        pollMessages(convId)
      }
    }, POLL_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [activeConversation?.id, pollMessages])

  // --- Polling: refresh conversation list every 10 seconds to update last messages / new threads ---
  useEffect(() => {
    if (!autoFetch) return

    const intervalId = setInterval(() => {
      chatService.getConversations().then((data) => {
        const list = Array.isArray(data) ? data : data?.data || data?.content || []
        setConversations(list)
      }).catch(() => {})
    }, 10000)

    return () => clearInterval(intervalId)
  }, [autoFetch])

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    messagesLoading,
    sending,
    error,
    fetchConversations,
    fetchMessages,
    startConversationWith,
    sendMessage,
    deleteMessage,
    selectConversation,
    setActiveConversation,
  }
}

export default useChat
