const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

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
        const addedThread = await threadRepositoryPostgres.addThread(newThread);

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
  });
});
