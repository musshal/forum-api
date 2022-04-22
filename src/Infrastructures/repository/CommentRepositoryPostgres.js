const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const { mapCommentDbToModel } = require('../../Commons/utils');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, threadId, owner) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments(id, thread_id, content, publisher) VALUES($1, $2, $3, $4) RETURNING id, content, publisher',
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows.map(mapCommentDbToModel)[0]);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.date, comments.content, users.username
      FROM comments
      INNER JOIN users ON comments.publisher = users.id
      WHERE thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyCommentPublisher(id, owner) {
    const query = {
      text: 'SELECT id, publisher FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].publisher !== owner) {
      throw new AuthorizationError('Anda bukan publisher');
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyExistingComment(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
