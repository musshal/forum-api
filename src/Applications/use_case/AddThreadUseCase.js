const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userIdFromAccessToken) {
    const newThread = new NewThread(useCasePayload);

    return this._threadRepository.addThread(newThread, userIdFromAccessToken);
  }
}

module.exports = AddThreadUseCase;
