const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({
    replyRepository,
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._replyRepository = replyRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseHeader, useCasePayload) {
    const { authorization } = useCaseHeader;
    const { content } = useCasePayload;

    const accessToken = await this._authenticationRepository.checkAvailabilityToken(
      authorization,
    );

    await this._authenticationTokenManager.verifyRefreshToken(accessToken);

    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken,
    );

    const newReply = new NewReply({ content });

    return this._replyRepository.addReply(newReply, owner);
  }
}

module.exports = AddReplyUseCase;
