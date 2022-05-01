const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyUseCase = require('../ReplyUseCase');

describe('ReplyUseCase', () => {
  describe('addReply', () => {
    it('should orchestrating the add reply action cerrectly', async () => {
      // Arrange
      const userIdFromAccessToken = 'user-123';

      const useCaseParam = {
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      const useCasePayload = {
        content: 'sebuah balasan',
      };

      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: userIdFromAccessToken,
      });

      /** mocking dependencies for use case */
      const mockReplyRepository = new ReplyRepository();
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /** mocking needed function */
      mockThreadRepository.verifyExistingThread = jest.fn(() => Promise.resolve(useCaseParam.threadId));
      mockCommentRepository.verifyExistingComment = jest.fn(() => Promise.resolve(useCaseParam.commentId));
      mockReplyRepository.addReply = jest.fn(() => Promise.resolve(
        new AddedReply({
          id: 'reply-123',
          content: useCasePayload.content,
          owner: userIdFromAccessToken,
        }),
      ));

      /** creating use case instance */
      const replyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const addedReply = await replyUseCase.addReply(
        useCaseParam,
        useCasePayload,
        userIdFromAccessToken,
      );

      // Assert
      expect(addedReply).toStrictEqual(expectedAddedReply);
      expect(mockThreadRepository.verifyExistingThread).toBeCalledWith(
        useCaseParam.threadId,
      );
      expect(mockCommentRepository.verifyExistingComment).toBeCalledWith(
        useCaseParam.commentId,
      );
      expect(mockReplyRepository.addReply).toBeCalledWith(
        new NewReply(useCasePayload),
        useCaseParam.threadId,
        useCaseParam.commentId,
        userIdFromAccessToken,
      );
    });
  });

  describe('deleteReply', () => {
    it('should orchestrating the delete reply action correctly', async () => {
      // Arrange
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

      /** mocking needed function */
      mockThreadRepository.verifyExistingThread = jest.fn(() => Promise.resolve(useCaseParam.threadId));
      mockCommentRepository.verifyExistingComment = jest.fn(() => Promise.resolve(useCaseParam.commentId));
      mockReplyRepository.verifyExistingReply = jest.fn(() => Promise.resolve(useCaseParam.replyId));
      mockReplyRepository.verifyReplyPublisher = jest.fn(() => Promise.resolve(useCaseParam.replyId, userIdFromAccessToken));
      mockReplyRepository.deleteReplyById = jest.fn(() => Promise.resolve({ status: 'success' }));

      /** creating use case instance */
      const replyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // Action
      const deletedReply = await replyUseCase.deleteReply(
        useCaseParam,
        userIdFromAccessToken,
      );

      // Assert
      expect(deletedReply).toStrictEqual(expectedDeletedReply);
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
});
