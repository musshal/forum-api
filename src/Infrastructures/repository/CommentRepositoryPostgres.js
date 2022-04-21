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

  async addComment(newComment, threadId) {
    const { content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const threadQuery = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const threadResult = await this._pool.query(threadQuery);

    if (!threadResult.rowCount) {
      throw new NotFoundError(
        'Gagal menambahkan komentar. Thread tidak ditemukan',
      );
    }

    const commentQuery = {
      text: 'INSERT INTO comments(id, thread_id, content, publisher) VALUES($1, $2, $3, $4) RETURNING id, content, publisher',
      values: [id, threadId, content, owner],
    };

    const commentResult = await this._pool.query(commentQuery);

    return new AddedComment(commentResult.rows.map(mapCommentDbToModel)[0]);
  }
}

module.exports = CommentRepositoryPostgres;
