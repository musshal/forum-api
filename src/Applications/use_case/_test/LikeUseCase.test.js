const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
  describe('addLike', () => {
    it('should orchestrating the add like action correctly', async () => {
      // Arrange
      const userIdFromAccessToken = 'user-123';

      const useCaseParam = {
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      const expectedAddedLike = {
        status: 'success',
      };

      /* mocking dependencies for use case */
      const mockLikeRepository = new LikeRepository();
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /* mocking needed function */
      mockThreadRepository.verifyExistingThread = jest.fn(() => Promise.resolve(useCaseParam.threadId));
      mockCommentRepository.verifyExistingComment = jest.fn(() => Promise.resolve(useCaseParam.commentId));
      mockLikeRepository.getLike = jest.fn(() => Promise.resolve([]));
      mockLikeRepository.addLike = jest.fn(() => Promise.resolve({ status: 'success' }));

      /* creating use case instance */
      const likeUseCase = new LikeUseCase({
        likeRepository: mockLikeRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const addedLike = await likeUseCase.execute(
        useCaseParam,
        userIdFromAccessToken,
      );

      // Assert
      expect(addedLike).toStrictEqual(expectedAddedLike);
      expect(mockThreadRepository.verifyExistingThread).toBeCalledWith(
        useCaseParam.threadId,
      );
      expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(
        useCaseParam.commentId,
      );
      expect(mockLikeRepository.getLike).toBeCalledWith(
        useCaseParam.threadId,
        useCaseParam.commentId,
        userIdFromAccessToken,
      );
      expect(mockLikeRepository.addLike).toBeCalledWith(
        useCaseParam.threadId,
        useCaseParam.commentId,
        userIdFromAccessToken,
      );
    });
  });

  describe('removeLike', () => {
    it('should orchestrating the remove like action correctly', async () => {
      // Arrange
      const userIdFromAccessToken = 'user-123';

      const useCaseParam = {
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      const retrievedLike = [
        {
          id: 'like-123',
          threadId: 'thread-123',
          commentId: 'thread-123',
          userId: userIdFromAccessToken,
        },
      ];

      const expectedRemovedLike = {
        status: 'success',
      };

      /* mocking dependencies for use case */
      const mockLikeRepository = new LikeRepository();
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /* mocking needed function */
      mockThreadRepository.verifyExistingThread = jest.fn(() => Promise.resolve(useCaseParam.threadId));
      mockCommentRepository.verifyExistingComment = jest.fn(() => Promise.resolve(useCaseParam.commentId));
      mockLikeRepository.getLike = jest.fn(() => Promise.resolve(retrievedLike));
      mockLikeRepository.removeLike = jest.fn(() => Promise.resolve({ status: 'success' }));

      /* creating use case instance */
      const likeUseCase = new LikeUseCase({
        likeRepository: mockLikeRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const removedLike = await likeUseCase.execute(
        useCaseParam,
        userIdFromAccessToken,
      );

      // Assert
      expect(removedLike).toStrictEqual(expectedRemovedLike);
      expect(mockThreadRepository.verifyExistingThread).toBeCalledWith(
        useCaseParam.threadId,
      );
      expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(
        useCaseParam.commentId,
      );
      expect(mockLikeRepository.getLike).toBeCalledWith(
        useCaseParam.threadId,
        useCaseParam.commentId,
        userIdFromAccessToken,
      );
      expect(mockLikeRepository.removeLike).toBeCalledWith(retrievedLike[0].id);
    });
  });
});
