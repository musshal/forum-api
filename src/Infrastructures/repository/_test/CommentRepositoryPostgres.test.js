const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComment function', () => {
      it('should create new comment and return added comment correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});

        const newComment = new NewComment({
          content: 'sebuah komentar',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123'; // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        // Action
        const addedComment = await commentRepositoryPostgres.addComment(
          newComment,
          'thread-123',
        );

        // Assert
        const comment = await CommentsTableTestHelper.findCommentById(
          'comment-123',
        );

        expect(addedComment).toStrictEqual(
          new AddedComment({
            id: `comment-${fakeIdGenerator()}`,
            content: 'sebuah komentar',
            owner: 'user-123',
          }),
        );
        expect(comment).toBeDefined();
      });

      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});

        const fakeIdGenerator = () => '123'; // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        const newComment = new NewComment({
          content: 'sebuah komentar',
          owner: 'user-123',
        });

        // Action and Assert
        await expect(
          commentRepositoryPostgres.addComment(newComment, 'thread-xxx'),
        ).rejects.toThrowError(NotFoundError);
      });
    });
  });
});
