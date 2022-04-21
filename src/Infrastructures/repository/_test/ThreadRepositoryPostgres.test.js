const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should create new thread and return added thread correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});

        const newThread = new NewThread({
          title: 'sebuah thread',
          body: 'sebuah body thread',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123'; // stub!
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        // Action
        const addedThread = await threadRepositoryPostgres.addThread(
          newThread,
          'thread-123',
        );

        // Assert
        const thread = await ThreadsTableTestHelper.findThreadById(
          'thread-123',
        );

        expect(addedThread).toStrictEqual(
          new AddedThread({
            id: `thread-${fakeIdGenerator()}`,
            title: 'sebuah thread',
            owner: 'user-123',
          }),
        );
        expect(thread).toBeDefined();
      });
    });

    describe('getThreadById function', () => {
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action and Assert
        await expect(
          threadRepositoryPostgres.getThreadById('thread-xxx'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should return detail thread when thread is found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const detailThread = await threadRepositoryPostgres.getThreadById(
          'thread-123',
        );

        // Assert
        const thread = await ThreadsTableTestHelper.findThreadById(
          'thread-123',
        );

        expect(detailThread).toStrictEqual(thread);
      });
    });

    describe('verifyExistingThread function', () => {
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action and Assert
        await expect(
          threadRepositoryPostgres.verifyExistingThread('thread-xxx'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should resolve when thread is found', async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await expect(
          threadRepositoryPostgres.verifyExistingThread('thread-123'),
        ).resolves.not.toThrowError();
      });
    });
  });
});
