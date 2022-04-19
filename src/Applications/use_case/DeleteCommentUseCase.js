class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    const { threadId, commentId, credentialId } = useCaseParam;

    await this._commentRepository.verifyExistingComment(threadId, commentId);
    await this._commentRepository.verifyCommentPublisher(
      commentId,
      credentialId,
    );

    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
