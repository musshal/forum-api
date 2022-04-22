const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const { mapReplyDbToModel } = require('../../Commons/utils');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, threadId, commentId, owner) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies(id, thread_id, comment_id, publisher, content) VALUES($1, $2, $3, $4, $5) RETURNING id, content, publisher',
      values: [id, threadId, commentId, owner, content],
    };

    const result = await this._pool.query(query);

    return new AddedReply(result.rows.map(mapReplyDbToModel)[0]);
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username
      FROM replies
      INNER JOIN users ON replies.publisher = users.id
      WHERE replies.thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

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
