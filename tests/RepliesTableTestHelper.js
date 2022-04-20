/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    owner = 'user-123',
    content = 'sebuah balasan',
  }) {
    const query = {
      text: 'INSERT INTO replies(id, thread_id, comment_id, publisher, content) VALUES($1, $2, $3, $4, $5) RETURNING content',
      values: [id, threadId, commentId, owner, content],
    };

    await pool.query(query);
  },

  async findRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, replies.comment_id, replies.content, replies.date, replies.is_delete, users.username
      FROM replies
      INNER JOIN users ON replies.publisher = users.id
      WHERE thread_id = $1`,
      values: [threadId],
    };

    const result = await pool.query(query);
    const replies = result.rows.map((reply) => ({
      id: reply.id,
      content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
      date: reply.date.toISOString(),
      username: reply.username,
    }));

    return replies;
  },

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
