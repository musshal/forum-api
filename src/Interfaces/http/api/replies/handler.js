const autoBind = require('auto-bind-es5');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postReplyHandler(request, h) {
    const { id } = request.auth.credentials;

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const addedReply = await addReplyUseCase.execute(
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
}

module.exports = RepliesHandler;
