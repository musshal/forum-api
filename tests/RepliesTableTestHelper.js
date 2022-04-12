/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-BErOXUSefjwWGW1Z10Ihk',
    content = 'sebuah balasan',
    publisher = 'user-CrkY5iAgOdMqv36bIvys2',
  }) {
    const query = {
      text: 'INSERT INTO replies(id, content, publisher) VALUES($1, $2, $3)',
      values: [id, content, publisher],
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
