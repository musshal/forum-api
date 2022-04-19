const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
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

  async execute(useCaseHeader, useCaseParam, useCasePayload) {
    const { authorization } = useCaseHeader;
    const { threadId, commentId } = useCaseParam;
    const { content } = useCasePayload;

    const accessToken = await this._authenticationRepository.checkAvailabilityToken(
      authorization,
    );

    await this._authenticationTokenManager.verifyRefreshToken(accessToken);

    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken,
    );

    await this._threadRepository.verifyExistingThread(threadId);
    await this._commentRepository.verifyExistingComment(commentId);

    const newReply = new NewReply({ content });

    return this._replyRepository.addReply(newReply, owner);
  }
}

module.exports = AddReplyUseCase;
