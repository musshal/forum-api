const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../CommentUseCase');
const NewComment = require('../../../Domains/comments/entities/NewComment');

describe('CommentUseCase', () => {
  describe('addComment', () => {
    it('should orchestrating the add comment action correctly', async () => {
      // Arrange
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

      /** mocking needed function */
      mockThreadRepository.verifyExistingThread = jest.fn(() => Promise.resolve(useCaseParam.threadId));
      mockCommentRepository.addComment = jest.fn(() => Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          content: useCasePayload.content,
          owner: userIdFromAccessToken,
        }),
      ));

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action
      const addedComment = await commentUseCase.addComment(
        useCaseParam,
        useCasePayload,
        userIdFromAccessToken,
      );

      // Assert
      expect(addedComment).toStrictEqual(expectedAddedComment);
      expect(mockThreadRepository.verifyExistingThread).toBeCalledWith(
        useCaseParam.threadId,
      );
      expect(mockCommentRepository.addComment).toBeCalledWith(
        new NewComment(useCasePayload),
        useCaseParam.threadId,
        userIdFromAccessToken,
      );
    });
  });

  describe('deleteComment', () => {
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
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      // Action
      const deletedComment = await commentUseCase.deleteComment(
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
});
