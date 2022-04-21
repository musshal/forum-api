const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {});

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addReply method', () => {
      it('should create new reply and return added reply correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        const newReply = new NewReply({
          content: 'sebuah balasan',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        // Action
        const addedReply = await replyRepositoryPostgres.addReply(
          newReply,
          'thread-123',
          'comment-123',
        );

        // Assert
        const reply = await RepliesTableTestHelper.findReplyById('reply-123');

        expect(addedReply).toStrictEqual(
          new AddedReply({
            id: `reply-${fakeIdGenerator()}`,
            content: 'sebuah balasan',
            owner: 'user-123',
          }),
        );
        expect(reply).toBeDefined();
      });

      it('should throw NotFoundError if the thread is not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        const fakeIdGenerator = () => '123';
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        const newReply = new NewReply({
          content: 'sebuah balasan',
          owner: 'user-123',
        });

        // Action and Assert
        await expect(
          replyRepositoryPostgres.addReply(
            newReply,
            'thread-xxx',
            'comment-123',
          ),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should throw NotFoundError if the comment is not found', async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        const fakeIdGenerator = () => '123';
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        const newReply = new NewReply({
          content: 'sebuah balasan',
          owner: 'user-123',
        });

        await expect(
          replyRepositoryPostgres.addReply(
            newReply,
            'thread-123',
            'comment-xxx',
          ),
        ).rejects.toThrowError(NotFoundError);
      });
    });
  });
});
