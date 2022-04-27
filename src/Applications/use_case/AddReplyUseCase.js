const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam, useCasePayload, userIdFromAccesToken) {
    const { threadId, commentId } = useCaseParam;

    await this._threadRepository.verifyExistingThread(threadId);
    await this._commentRepository.verifyExistingComment(commentId);

    const newReply = new NewReply(useCasePayload);

    return this._replyRepository.addReply(
      newReply,
      threadId,
      commentId,
      userIdFromAccesToken,
    );
  }
}

module.exports = AddReplyUseCase;
