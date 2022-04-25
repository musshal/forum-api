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

    const retrievedThread = [
      new DetailThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2022',
        username: 'dicoding',
        comments: [],
      }),
    ];

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

    const detailReplies = [
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

    const {
      commentId: commentIdReplyA,
      isDelete: isDeleteReplyA,
      ...filteredDetailReplyA
    } = detailReplies[0];
    const {
      commentId: commentIdReplyB,
      isDelete: isDeleteReplyB,
      ...filteredDetailReplyB
    } = detailReplies[1];

    const detailComments = [
      {
        ...retrievedComments[0],
        replies: [filteredDetailReplyA],
        content: retrievedComments[0].isDelete
          ? '**komentar telah dihapus**'
          : retrievedComments[0].content,
      },
      {
        ...retrievedComments[1],
        replies: [filteredDetailReplyB],
        content: retrievedComments[1].isDelete
          ? '**komentar telah dihapus**'
          : retrievedComments[1].content,
      },
    ];

    const { isDelete: isDeleteCommentA, ...filteredDetailCommentA } = detailComments[0];
    const { isDelete: isDeleteCommentB, ...filteredDetailCommentB } = detailComments[1];

    const expectedDetailThread = {
      ...retrievedThread[0],
      comments: [{ ...filteredDetailCommentA }, { ...filteredDetailCommentB }],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(retrievedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(detailComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(detailReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const useCaseResult = await getThreadUseCase.execute(useCaseParam);

    // Assert
    expect(useCaseResult).toStrictEqual(expectedDetailThread);
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
