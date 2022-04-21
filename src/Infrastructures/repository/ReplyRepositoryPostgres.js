const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const { mapReplyDbToModel } = require('../../Commons/utils');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, threadId, commentId) {
    const { content, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const threadQuery = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const threadResult = await this._pool.query(threadQuery);

    if (!threadResult.rowCount) {
      throw new NotFoundError(
        'Gagal mengirimkan balasan. Thread tidak ditemukan',
      );
    }

    const commentQuery = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const commentResult = await this._pool.query(commentQuery);

    if (!commentResult.rowCount) {
      throw new NotFoundError(
        'Gagal mengirimkan balasan. Komentar tidak ditemukan',
      );
    }

    const replyQuery = {
      text: 'INSERT INTO replies(id, thread_id, comment_id, publisher, content) VALUES($1, $2, $3, $4, $5) RETURNING id, content, publisher',
      values: [id, threadId, commentId, owner, content],
    };

    const replyResult = await this._pool.query(replyQuery);

    return new AddedReply(replyResult.rows.map(mapReplyDbToModel)[0]);
  }

  async getRepliesByThreadIdAndCommentId(threadId, commentId) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username
      FROM replies
      INNER JOIN users ON replies.publisher = users.id
      WHERE replies.thread_id = $1 AND replies.comment_id = $2`,
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }

    return result.rows;
  }

  async verifyReplyPublisher(id, owner) {
    const query = {
      text: 'SELECT id, publisher FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }

    if (result.rows[0].publisher !== owner) {
      throw new AuthorizationError('Anda bukan publisher');
    }
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyExistingReply(id) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
