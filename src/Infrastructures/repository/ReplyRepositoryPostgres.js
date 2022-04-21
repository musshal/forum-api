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
}

module.exports = ReplyRepositoryPostgres;
