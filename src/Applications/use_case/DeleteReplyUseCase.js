class DeleteReplyUseCase {
  constructor({
    replyRepository,
    threadRepository,
    commentRepository,
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseHeader, useCaseParam) {
    const { authorization } = useCaseHeader;
    const { threadId, commentId, replyId } = useCaseParam;

    const accessToken = await this._authenticationRepository.checkAvailabilityToken(
      authorization,
    );

    await this._authenticationTokenManager.verifyRefreshToken(accessToken);

    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken,
    );

    await this._threadRepository.verifyExistingThread(threadId);
    await this._commentRepository.verifyExistingComment(commentId);
    await this._replyRepository.verifyExistingReply(replyId);
    await this._replyRepository.verifyReplyPublisher(replyId, owner);

    return this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
