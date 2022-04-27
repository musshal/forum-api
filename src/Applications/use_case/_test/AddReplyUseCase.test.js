const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
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
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(
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
