/* istanbul ignore file */

const {
  mapThreadsDbToModel,
  mapCommentsDbToModel,
  mapRepliesDbToModel,
} = require('../src/Commons/utils');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'sebuah thread',
    body = 'sebuah body thread',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads(id, title, body, publisher) VALUES($1, $2, $3, $4)',
      values: [id, title, body, owner],
    };

    await pool.query(query);
  },

  async getThreadById(id) {
    const query = [
      {
        text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
        FROM threads
        INNER JOIN users ON threads.publisher = users.id
        WHERE id = $1`,
        values: [id],
      },
      {
        text: `SELECT comments.id, comments.date, comments.content, users.username
        FROM comments
        INNER JOIN users ON comments.publisher = users.id
        WHERE thread_id = $1`,
        values: [id],
      },
      {
        text: `SELECT replies.id, replies.comment_id, replies.content, replies.date, users.username
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
      .map(mapRepliesDbToModel);
    const comments = commentsResult.rows
      .map((comment) => ({ ...comment, replies: replies(comment.id) }))
      .map(mapCommentsDbToModel);

    const thread = threadResult.rows
      .map(mapThreadsDbToModel)
      .map((t) => ({ ...t, comments }));

    return thread;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
