const autoBind = require('auto-bind-es5');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const { id } = request.auth.credentials;

    const useCasePayload = {
      ...request.payload,
      owner: id,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    response.code(201);

    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId: id } = request.params;

    const useCaseParam = { threadId: id };

    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(useCaseParam);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });

    response.code(200);

    return response;
  }
}

module.exports = ThreadsHandler;
