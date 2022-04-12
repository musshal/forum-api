/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentRepliesTableTestHelper = {
  async addCommentReply({
    id = 'commentreply-123',
    commentId = 'comment-_pby2_tmXV6bcvcdev8xk',
    replyId = 'reply-BErOXUSefjwWGW1Z10Ihk',
  }) {
    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, $3)',
      values: [id, commentId, replyId],
    };

    await pool.query(query);
  },

  async findCommentReplyById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_replies WHERE 1=1');
  },
};

module.exports = CommentRepliesTableTestHelper;
