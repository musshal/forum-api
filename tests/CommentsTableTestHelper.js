/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    content = 'sebuah komentar',
  }) {
    const query = {
      text: 'INSERT INTO comments(id, thread_id, publisher, content) VALUES($1, $2, $3, $4) RETURNING content',
      values: [id, threadId, owner, content],
    };

    await pool.query(query);
  },

  async findCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.date, comments.content, comments.is_delete, users.username
      FROM comments
      INNER JOIN users ON comments.publisher = users.id
      WHERE thread_id = $1`,
      values: [threadId],
    };

    const result = await pool.query(query);
    const comments = result.rows.map((comment) => ({
      id: comment.id,
      date: comment.date.toISOString(),
      content: comment.id_delete
        ? '**komentar telah diahpus**'
        : comment.content,
      username: comment.username,
    }));

    return comments;
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
