const {
  mapCommentsDbToModel,
  mapThreadsDbToModel,
  mapReplies,
} = require('../../Commons/utils');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;

    const threadResult = await this._threadRepository.getThreadById(threadId);
    const commentsResult = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );
    const repliesResult = await this._replyRepository.getRepliesByThreadId(
      threadId,
    );

    const replies = (commentId) => repliesResult
      .filter((reply) => reply.commentId === commentId)
      .map((r) => ({
        ...r,
        content: r.isDelete ? '**balasan telah dihapus**' : r.content,
      }))
      .map(mapReplies);

    const comments = commentsResult
      .map((comment) => ({
        ...comment,
        content: comment.isDelete
          ? '**komentar telah dihapus**'
          : comment.content,
        replies: replies(comment.id),
      }))
      .map(mapCommentsDbToModel);

    const thread = threadResult
      .map(mapThreadsDbToModel)
      .map((t) => ({ ...t, comments: [comments] }))[0];

    return new DetailThread({ ...thread });
  }
}

module.exports = GetThreadUseCase;
