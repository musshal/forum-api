const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({
    threadRepository,
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._threadRepository = threadRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseHeader, useCasePayload) {
    const { authorization } = useCaseHeader;
    const { title, body } = useCasePayload;

    const accessToken = await this._authenticationRepository.checkAvailabilityToken(
      authorization,
    );

    await this._authenticationTokenManager.verifyRefreshToken(accessToken);

    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken,
    );

    const newThread = new NewThread({ title, body, owner });

    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
