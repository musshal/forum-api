const {
  mapRepliesDbToModel,
  mapCommentsDbToModel,
  mapThreadsDbToModel,
} = require('../../Commons/exceptions/utils');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const thread = await this._threadRepository.getThreadById(threadId);
    const commentsResult = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );
    const repliesResult = await this._replyRepository.getRepliesByThreadId(
      threadId,
    );

    const replies = (commentId) => repliesResult
      .filter((reply) => reply.comment_id === commentId)
      .map((r) => ({
        ...r,
        content: r.is_delete ? '**balasan telah dihapus**' : r.content,
      }))
      .map(mapRepliesDbToModel);

    const comments = commentsResult
      .map((comment) => ({
        ...comment,
        content: comment.is_delete
          ? '**komentar telah dihapus**'
          : comment.content,
        replies: replies(comment.id),
      }))
      .map(mapCommentsDbToModel);

    thread.comments = comments;

    return thread;
  }
}

module.exports = GetThreadUseCase;
