const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      credentialId: 'user-123',
    };

    const expectedDeletedComment = {
      status: 'success',
    };

    /** orchestrating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyExistingComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentPublisher = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDeletedComment));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(useCaseParam);

    // Assert
    expect(deletedComment).toStrictEqual(expectedDeletedComment);
    expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(
      useCaseParam.threadId,
      useCaseParam.commentId,
    );
    expect(mockCommentRepository.verifyCommentPublisher).toBeCalledWith(
      useCaseParam.commentId,
      useCaseParam.credentialId,
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      useCaseParam.commentId,
    );
  });
});
