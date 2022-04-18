/* istanbul ignore file */

const { mapCommentsDbToModel } = require('../src/Commons/utils');
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    content = 'sebuah comment',
  }) {
    const query = {
      text: 'INSERT INTO comments(id, thread_id, publisher, content) VALUES($1, $2, $3, $4)',
      values: [id, threadId, owner, content],
    };

    await pool.query(query);
  },

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.date, comments.content, users.username
      FROM comments
      INNER JOIN users ON comments.publisher = users.id
      WHERE thread_id = $1`,
      values: [threadId],
    };

    const result = await pool.query(query);

    return result.rows.map(mapCommentsDbToModel);
  },

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
