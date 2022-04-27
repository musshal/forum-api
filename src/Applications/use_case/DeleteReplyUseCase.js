class DeleteReplyUseCase {
  constructor({
    replyRepository,
    threadRepository,
    commentRepository,
  }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam, userIdFromAccesToken) {
    const { threadId, commentId, replyId } = useCaseParam;

    await this._threadRepository.verifyExistingThread(threadId);
    await this._commentRepository.verifyExistingComment(commentId);
    await this._replyRepository.verifyExistingReply(replyId);
    await this._replyRepository.verifyReplyPublisher(replyId, userIdFromAccesToken);

    return this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
