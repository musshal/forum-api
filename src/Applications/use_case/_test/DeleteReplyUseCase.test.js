const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const accessToken = 'accessToken';

    const useCaseHeader = {
      authorization: `Bearer ${accessToken}`,
    };

    const userIdFromAccessToken = 'user-123';

    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const expectedDeletedReply = {
      status: 'success',
    };

    /** orchestrating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.verifyRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));
    mockReplyRepository.verifyReplyPublisher = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDeletedReply));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const deletedReply = await deleteReplyUseCase.execute(
      useCaseHeader,
      useCaseParam,
    );

    // Assert
    expect(deletedReply).toStrictEqual(expectedDeletedReply);
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
      useCaseHeader.authorization,
    );
    expect(
      mockAuthenticationTokenManager.verifyRefreshToken(),
    ).resolves.toBeUndefined();
    expect(mockReplyRepository.verifyReplyPublisher).toBeCalledWith(
      useCaseParam.replyId,
      userIdFromAccessToken,
    );
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(
      useCaseParam.replyId,
    );
  });
});
