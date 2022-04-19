const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const accessToken = 'accessToken';

    const useCaseHeader = {
      authorization: `Bearer ${accessToken}`,
    };

    const userIdFromAccessToken = 'user-123';

    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const expectedDeletedComment = {
      status: 'success',
    };

    /** orchestrating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
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
      .mockImplementation(() => Promise.resolve({ id: userIdFromAccessToken }));
    mockThreadRepository.verifyExistingThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCaseParam.threadId));
    mockCommentRepository.verifyExistingComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCaseParam.commentId));
    mockCommentRepository.verifyCommentPublisher = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCaseParam.commentId, userIdFromAccessToken));
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDeletedComment));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(
      useCaseHeader,
      useCaseParam,
    );

    // Assert
    expect(deletedComment).toStrictEqual(expectedDeletedComment);
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
      useCaseHeader.authorization,
    );
    expect(
      mockAuthenticationTokenManager.verifyRefreshToken(),
    ).resolves.toBeUndefined();
    expect(mockThreadRepository.verifyExistingThread).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(
      useCaseParam.commentId,
    );
    expect(mockCommentRepository.verifyCommentPublisher).toBeCalledWith(
      useCaseParam.commentId,
      userIdFromAccessToken,
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      useCaseParam.commentId,
    );
  });
});
