const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2022',
      username: 'dicoding',
      comments: [],
    });

    const retrievedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'user A',
        date: '2022',
        replies: [],
        content: 'sebuah comment A',
      }),
      new DetailComment({
        id: 'comment-234',
        username: 'user B',
        date: '2022',
        replies: [],
        content: 'sebuah comment B',
      }),
    ];

    const retrievedReplies = [
      new DetailReply({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'sebuah balasan C',
        date: '2022',
        username: 'user C',
      }),
      new DetailReply({
        id: 'reply-234',
        commentId: 'comment-234',
        content: 'sebuah balasan D',
        date: '2022',
        username: 'user D',
      }),
    ];

    const { commentId: commentIdA, ...filteredDetailReplyA } = retrievedReplies[0];
    const { commentId: commentIdB, ...filteredDetailReplyB } = retrievedReplies[1];

    const expectedCommentReplies = [
      { ...retrievedComments[0], replies: [filteredDetailReplyA] },
      { ...retrievedComments[1], replies: [filteredDetailReplyB] },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(retrievedComments));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(retrievedReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const useCaseResult = await getThreadUseCase.execute(useCaseParam);

    // Assert
    expect(useCaseResult).toEqual(
      new DetailThread({
        ...expectedDetailThread,
        comments: expectedCommentReplies,
      }),
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCaseParam.threadId,
    );
  });
});
