/* istanbul ignore file */

const mapThreadDbToModel = require('../src/Commons/utils');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'sebuah thread',
    body = 'sebuah body thread',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads(id, title, body, publisher) VALUES($1, $2, $3, $4) RETURNING id, title, publisher',
      values: [id, title, body, owner],
    };

    const result = await pool.query(query);

    return result.rows.map(mapThreadDbToModel);
  },

  async findThreadById(id) {
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

    const threadResult = await pool.query(query[0]);
    const commentsResult = await pool.query(query[1]);
    const repliesResult = await pool.query(query[2]);

    const replies = (commentId) => repliesResult.rows
      .filter((reply) => reply.comment_id === commentId)
      .map((reply) => ({
        id: reply.id,
        content: reply.is_delete
          ? '**balasan telah dihapus**'
          : reply.content,
        date: reply.date.toISOString(),
        username: reply.username,
      }));

    const comments = commentsResult.rows.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date.toISOString(),
      replies: replies(comment.id),
      content: comment.is_delete
        ? '**komentar telah dihapus**'
        : comment.content,
    }));

    const thread = {
      ...threadResult.rows[0],
      date: threadResult.rows[0].date.toISOString(),
      comments: [...comments],
    };

    return thread;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
