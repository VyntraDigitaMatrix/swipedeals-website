import api from '../api/axios'
import { toUuid } from '../utils/uuid'

/**
 * Service for Chat Controller endpoints (/api/chat/**)
 */
export const chatService = {
  /**
   * POST /api/chat/start/conversations
   * Starts a new conversation with a recipient (or returns existing).
   * Body: { recipientId: string (uuid) }
   */
  startConversation: async (recipientId) => {
    const validRecipientId = toUuid(recipientId)
    const res = await api.post('/api/chat/start/conversations', { recipientId: validRecipientId })
    return res.data
  },

  /**
   * GET /api/chat/conversations
   * Retrieves all chat conversations for the logged-in user.
   */
  getConversations: async () => {
    const res = await api.get('/api/chat/conversations')
    return res.data
  },

  /**
   * GET /api/chat/conversations/{conversationId}/messages
   * Retrieves paginated messages for a specific conversation ID.
   */
  getMessages: async (conversationId, params = {}) => {
    const validConversationId = toUuid(conversationId)
    const res = await api.get(`/api/chat/conversations/${encodeURIComponent(validConversationId)}/messages`, { params })
    return res.data
  },

  /**
   * POST /api/chat/send/{conversationId}/messages
   * Sends a message in a conversation.
   * Body: { content: string, replyToMessageId?: string (uuid) }
   */
  sendMessage: async (conversationId, { content, replyToMessageId = null }) => {
    const validConversationId = toUuid(conversationId)
    const payload = {
      content,
      replyToMessageId: replyToMessageId ? toUuid(replyToMessageId) : null,
    }
    const res = await api.post(`/api/chat/send/${encodeURIComponent(validConversationId)}/messages`, payload)
    return res.data
  },

  /**
   * POST /api/chat/messages/seen
   * Marks all messages in a conversation as seen.
   * Body: { conversationId: string (uuid) }
   */
  markAsSeen: async (conversationId) => {
    const validConversationId = toUuid(conversationId)
    const res = await api.post('/api/chat/messages/seen', { conversationId: validConversationId })
    return res.data
  },

  /**
   * DELETE /api/chat/message
   * Deletes a chat message by message ID.
   * Body: { messageId: string (uuid) }
   */
  deleteMessage: async (messageId) => {
    const validMessageId = toUuid(messageId)
    const res = await api.delete('/api/chat/message', { data: { messageId: validMessageId } })
    return res.data
  },
}

export default chatService
