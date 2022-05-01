const autoBind = require('auto-bind-es5');
const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postReplyHandler(request, h) {
    const { id } = request.auth.credentials;

    const replyUseCase = this._container.getInstance(ReplyUseCase.name);

    const addedReply = await replyUseCase.addReply(
      request.params,
      request.payload,
      id,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);

    return response;
  }

  async deleteReplyHandler(request, h) {
    const { id } = request.auth.credentials;

    const replyUseCase = this._container.getInstance(
      ReplyUseCase.name,
    );

    await replyUseCase.deleteReply(request.params, id);

    const response = h.response({
      status: 'success',
    });

    response.code(200);

    return response;
  }
}

module.exports = RepliesHandler;
