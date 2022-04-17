const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    const accessToken = 'accessToken';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));
    mockAuthenticationTokenManager.verifyRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve(accessToken));
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ username: 'dicoding', id: expectedAddedThread.owner }));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(
      mockAuthenticationTokenManager.verifyRefreshToken(),
    ).resolves.toBeUndefined();
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      accessToken,
    );
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: expectedAddedThread.owner,
      }),
    );
  });
});
