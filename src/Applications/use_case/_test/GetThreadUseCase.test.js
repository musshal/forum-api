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

    const retrievedThread = new DetailThread({
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
        isDelete: false,
      }),
      new DetailComment({
        id: 'comment-234',
        username: 'user B',
        date: '2022',
        replies: [],
        content: 'sebuah comment B',
        isDelete: false,
      }),
    ];

    const retrievedReplies = [
      new DetailReply({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'sebuah balasan C',
        date: '2022',
        username: 'user C',
        isDelete: false,
      }),
      new DetailReply({
        id: 'reply-234',
        commentId: 'comment-234',
        content: 'sebuah balasan D',
        date: '2022',
        username: 'user D',
        isDelete: false,
      }),
    ];

    const { isDelete: isDeleteCommentA, ...filteredDetailCommentA } = retrievedComments[0];
    const { isDelete: isDeleteCommentB, ...filteredDetailCommentB } = retrievedComments[1];

    const { isDelete: isDeleteReplyA, ...filteredDetailReplyA } = retrievedReplies[0];
    const { isDelete: isDeleteReplyB, ...filteredDetailReplyB } = retrievedReplies[1];

    const expectedDetailReplies = [
      { ...filteredDetailReplyA },
      { ...filteredDetailReplyB },
    ];

    const expectedDetailComments = [
      { ...filteredDetailCommentA, replies: [filteredDetailReplyA] },
      { ...filteredDetailCommentB, replies: [filteredDetailReplyB] },
    ];

    const expectedDetailThread = {
      ...retrievedThread,
      comments: [expectedDetailComments],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(retrievedThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDetailComments));
    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDetailReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const useCaseResult = await getThreadUseCase.execute(useCaseParam);

    // Assert
    expect(useCaseResult).toEqual(new DetailThread(expectedDetailThread));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      useCaseParam.threadId,
    );
  });
});
