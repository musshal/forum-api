const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
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
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
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
    mockReplyRepository.verifyExistingReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCaseParam.replyId));
    mockReplyRepository.verifyReplyPublisher = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCaseParam.replyId, userIdFromAccessToken));
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDeletedReply));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
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
    expect(mockThreadRepository.verifyExistingThread).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(
      useCaseParam.commentId,
    );
    expect(mockReplyRepository.verifyExistingReply).toBeCalledWith(
      useCaseParam.replyId,
    );
    expect(mockReplyRepository.verifyReplyPublisher).toBeCalledWith(
      useCaseParam.replyId,
      userIdFromAccessToken,
    );
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(
      useCaseParam.replyId,
    );
  });
});
