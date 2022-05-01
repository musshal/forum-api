const NewReply = require('../../Domains/replies/entities/NewReply');

class ReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addReply(useCaseParam, useCasePayload, userIdFromAccesToken) {
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

  async deleteReply(useCaseParam, userIdFromAccesToken) {
    const { threadId, commentId, replyId } = useCaseParam;

    await this._threadRepository.verifyExistingThread(threadId);
    await this._commentRepository.verifyExistingComment(commentId);
    await this._replyRepository.verifyExistingReply(replyId);
    await this._replyRepository.verifyReplyPublisher(
      replyId,
      userIdFromAccesToken,
    );

    return this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = ReplyUseCase;
