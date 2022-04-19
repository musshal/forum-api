const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const accessToken = 'accessToken';

    const useCaseHeader = {
      authorization: `Bearer ${accessToken}`,
    };

    const userIdFromAccessToken = 'user-123';

    const useCaseParam = {
      threadId: 'thread-123',
    };

    const useCasePayload = {
      content: 'sebuah comment',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userIdFromAccessToken,
    });

    /** creating dependency of use case */
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
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      useCaseHeader,
      useCaseParam,
      useCasePayload,
    );

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
      useCaseHeader.authorization,
    );
    expect(
      mockAuthenticationTokenManager.verifyRefreshToken(),
    ).resolves.toBeUndefined();
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      accessToken,
    );
    expect(mockThreadRepository.verifyExistingThread).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({ content: useCasePayload.content }),
      expectedAddedComment.owner,
    );
  });
});
