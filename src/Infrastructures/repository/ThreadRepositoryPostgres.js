const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const { mapThreadDbToModel } = require('../../Commons/utils');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads(id, title, body, publisher) VALUES($1, $2, $3, $4) RETURNING id, title, publisher',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows.map(mapThreadDbToModel)[0]);
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
        FROM threads
        INNER JOIN users ON threads.publisher = users.id
        WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const thread = result.rows[0];

    return thread;
  }

  async verifyExistingThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
