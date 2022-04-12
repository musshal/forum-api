/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addThreadComment({
    id = 'threadcomment-123',
    threadId = 'thread-h_2FkLZhtgBKY2kh4CC02',
    commentId = 'comment-_pby2_tmXV6bcvcdev8xk',
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3)',
      values: [id, threadId, commentId],
    };

    await pool.query(query);
  },

  async findThreadCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
