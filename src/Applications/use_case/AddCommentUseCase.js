const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({
    commentRepository,
    threadRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCaseParam, useCasePayload, userIdFromAccessToken) {
    const { threadId } = useCaseParam;

    await this._threadRepository.verifyExistingThread(threadId);

    const newComment = new NewComment(useCasePayload);

    return this._commentRepository.addComment(newComment, threadId, userIdFromAccessToken);
  }
}

module.exports = AddCommentUseCase;
