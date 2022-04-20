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
        isDelete: true,
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
        isDelete: true,
      }),
    ];

    const expectedDetailReplies = [
      {
        ...retrievedReplies[0],
        content: retrievedReplies[0].isDelete
          ? '**balasan telah dihapus**'
          : retrievedReplies[0].content,
      },
      {
        ...retrievedReplies[1],
        content: retrievedReplies[1].isDelete
          ? '**balasan telah dihapus**'
          : retrievedReplies[1].content,
      },
    ];

    const expectedDetailComments = [
      {
        ...retrievedComments[0],
        replies: [
          {
            id: expectedDetailReplies[0].id,
            content: expectedDetailReplies[0].content,
            date: expectedDetailReplies[0].date,
            username: expectedDetailReplies[0].username,
          },
        ],
        content: retrievedComments[0].isDelete
          ? '**komentar telah dihapus**'
          : retrievedComments[0].content,
      },
      {
        ...retrievedComments[1],
        replies: [
          {
            id: expectedDetailReplies[1].id,
            content: expectedDetailReplies[1].content,
            date: expectedDetailReplies[1].date,
            username: expectedDetailReplies[1].username,
          },
        ],
        content: retrievedComments[1].isDelete
          ? '**komentar telah dihapus**'
          : retrievedComments[1].content,
      },
    ];

    const expectedDetailThread = {
      ...retrievedThread,
      comments: [
        {
          id: expectedDetailComments[0].id,
          username: expectedDetailComments[0].username,
          date: expectedDetailComments[0].date,
          replies: expectedDetailComments[0].replies,
          content: expectedDetailComments[0].content,
        },
        {
          id: expectedDetailComments[1].id,
          username: expectedDetailComments[1].username,
          date: expectedDetailComments[1].date,
          replies: expectedDetailComments[1].replies,
          content: expectedDetailComments[1].content,
        },
      ],
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
