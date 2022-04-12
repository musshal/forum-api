/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');
const { cleanTable } = require('./UsersTableTestHelper');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-h_2FkLZhtgBKY2kh4CC02',
    title = 'sebuah thread',
    body = 'sebuah body thread',
    publisher = 'dicoding',
  }) {
    const query = {
      text: 'INSERT INTO threads(id, title, body, publisher) VALUES($1, $2, $3, $4)',
      values: [id, title, body, publisher],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
