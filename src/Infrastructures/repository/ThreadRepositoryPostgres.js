const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const mapThreadDbToModel = require('../../Commons/utils');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
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
    const query = [
      {
        text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
        FROM threads
        INNER JOIN users ON threads.publisher = users.id
        WHERE threads.id = $1`,
        values: [id],
      },
      {
        text: `SELECT comments.id, comments.date, comments.content, comments.is_delete, users.username
        FROM comments
        INNER JOIN users ON comments.publisher = users.id
        WHERE thread_id = $1`,
        values: [id],
      },
      {
        text: `SELECT replies.id, replies.comment_id, replies.content, replies.date, replies.is_delete, users.username
        FROM replies
        INNER JOIN users ON replies.publisher = users.id
        WHERE thread_id = $1`,
        values: [id],
      },
    ];

    const threadResult = await this._pool.query(query[0]);
    const commentsResult = await this._pool.query(query[1]);
    const repliesResult = await this._pool.query(query[2]);

    const replies = (commentId) => repliesResult.rows
      .filter((reply) => reply.comment_id === commentId)
      .map((reply) => ({
        id: reply.id,
        content: reply.content,
        date: reply.date.toISOString(),
        username: reply.username,
      }));

    const comments = commentsResult.rows.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date.toISOString(),
      replies: replies(comment.id),
      content: comment.content,
    }));

    if (!threadResult.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const thread = {
      ...threadResult.rows[0],
      date: threadResult.rows[0].date.toISOString(),
      comments: [...comments],
    };

    return new DetailThread(thread);
  }
}

module.exports = ThreadRepositoryPostgres;
