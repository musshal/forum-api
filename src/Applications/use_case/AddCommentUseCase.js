const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
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

  async execute(useCaseHeader, useCaseParam, useCasePayload) {
    const { authorization } = useCaseHeader;
    const { threadId } = useCaseParam;
    const { content } = useCasePayload;

    const accessToken = await this._authenticationRepository.checkAvailabilityToken(
      authorization,
    );

    await this._authenticationTokenManager.verifyRefreshToken(accessToken);

    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken,
    );

    await this._threadRepository.verifyExistingThread(threadId);

    const newComment = new NewComment({ content });

    return this._commentRepository.addComment(newComment, owner);
  }
}

module.exports = AddCommentUseCase;
