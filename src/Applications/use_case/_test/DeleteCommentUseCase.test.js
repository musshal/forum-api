const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
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

    /** mocking needed function */
    mockThreadRepository.verifyExistingThread = jest.fn(() => Promise.resolve(useCaseParam.threadId));
    mockCommentRepository.verifyExistingComment = jest.fn(() => Promise.resolve(useCaseParam.commentId));
    mockCommentRepository.verifyCommentPublisher = jest.fn(() => Promise.resolve(useCaseParam.commentId, userIdFromAccessToken));
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve({ status: 'success' }));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(
      useCaseParam,
      userIdFromAccessToken,
    );

    // Assert
    expect(deletedComment).toStrictEqual(expectedDeletedComment);
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
