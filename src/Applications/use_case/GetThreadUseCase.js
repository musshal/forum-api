class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const thread = await this._threadRepository.getThreadById(threadId);

    thread.comments = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );

    for (let i = 0; i < thread.comments.length; i += 1) {
      const commentReplies = await this._replyRepository.getRepliesByCommentId(
        thread.comments[i].id,
      );

      thread.comments[i].replies = commentReplies
        .filter((reply) => reply.commentId === thread.comments[i].id)
        .map((reply) => {
          const { commentId, ...filteredDetailReply } = reply;

          return filteredDetailReply;
        });
    }

    return thread;
  }
}

module.exports = GetThreadUseCase;
