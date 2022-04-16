/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-BErOXUSefjwWGW1Z10Ihk',
    commentId = 'comment-_pby2_tmXV6bcvcdev8xk',
    publisher = 'user-123',
    content = 'sebuah balasan',
  }) {
    const query = {
      text: 'INSERT INTO replies(id, comment_id, publisher, content) VALUES($1, $2, $3, $4)',
      values: [id, commentId, publisher, content],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
