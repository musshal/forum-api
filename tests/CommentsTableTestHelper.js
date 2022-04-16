/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-_pby2_tmXV6bcvcdev8xk',
    threadId = 'thread-h_2FkLZhtgBKY2kh4CC02',
    publisher = 'user-123',
    content = 'sebuah comment',
  }) {
    const query = {
      text: 'INSERT INTO comments(id, thread_id, publisher, content) VALUES($1, $2, $3, $4)',
      values: [id, threadId, publisher, content],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
