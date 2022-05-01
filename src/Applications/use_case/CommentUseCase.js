const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addComment(useCaseParam, useCasePayload, userIdFromAccessToken) {
    const { threadId } = useCaseParam;

    await this._threadRepository.verifyExistingThread(threadId);

    const newComment = new NewComment(useCasePayload);

    return this._commentRepository.addComment(
      newComment,
      threadId,
      userIdFromAccessToken,
    );
  }

  async deleteComment(useCaseParam, userIdFromAccessToken) {
    const { threadId, commentId } = useCaseParam;

    await this._threadRepository.verifyExistingThread(threadId);
    await this._commentRepository.verifyExistingComment(commentId);
    await this._commentRepository.verifyCommentPublisher(
      commentId,
      userIdFromAccessToken,
    );

    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = CommentUseCase;
