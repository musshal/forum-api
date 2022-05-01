const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async addThread(useCasePayload, userIdFromAccessToken) {
    const newThread = new NewThread(useCasePayload);

    return this._threadRepository.addThread(newThread, userIdFromAccessToken);
  }

  async getThread(useCaseParam) {
    const { threadId } = useCaseParam;

    const threadResult = await this._threadRepository.getThreadById(threadId);
    const commentsResult = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );
    const repliesResult = await this._replyRepository.getRepliesByThreadId(
      threadId,
    );
    const likesResult = await this._likeRepository.getLikesByThreadId(threadId);

    const likeCount = (commentId) => (likesResult.filter((like) => like.commentId === commentId)).length;

    const replies = (commentId) => repliesResult
      .filter((reply) => reply.commentId === commentId)
      .map((reply) => ({
        id: reply.id,
        content: reply.isDelete ? '**balasan telah dihapus**' : reply.content,
        date: reply.date,
        username: reply.username,
      }));

    const comments = commentsResult.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      replies: replies(comment.id),
      content: comment.isDelete
        ? '**komentar telah dihapus**'
        : comment.content,
      likeCount: likeCount(comment.id),
    }));

    const thread = {
      ...threadResult[0],
      comments: [...comments],
    };

    return thread;
  }
}

module.exports = ThreadUseCase;
