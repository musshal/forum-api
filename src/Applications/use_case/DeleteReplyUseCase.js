class DeleteReplyUseCase {
  constructor({
    replyRepository,
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._replyRepository = replyRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseHeader, useCaseParam) {
    const { authorization } = useCaseHeader;
    const { replyId } = useCaseParam;

    const accessToken = await this._authenticationRepository.checkAvailabilityToken(
      authorization,
    );

    await this._authenticationTokenManager.verifyRefreshToken(accessToken);

    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken,
    );

    await this._replyRepository.verifyReplyPublisher(replyId, owner);

    return this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
