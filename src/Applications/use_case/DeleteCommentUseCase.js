class DeleteCommentUseCase {
  constructor({
    commentRepository,
    threadRepository,
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseHeader, useCaseParam) {
    const { authorization } = useCaseHeader;
    const { threadId, commentId } = useCaseParam;

    const accessToken = await this._authenticationRepository.checkAvailabilityToken(
      authorization,
    );

    await this._authenticationTokenManager.verifyRefreshToken(accessToken);

    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken,
    );

    await this._threadRepository.verifyExistingThread(threadId);
    await this._commentRepository.verifyExistingComment(commentId);
    await this._commentRepository.verifyCommentPublisher(commentId, owner);

    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
