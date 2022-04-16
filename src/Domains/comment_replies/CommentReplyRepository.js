class CommentReplyRepository {
  async addReplyToComment(commentId, replyId) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesFromComment(commentId) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentReplyRepository;
