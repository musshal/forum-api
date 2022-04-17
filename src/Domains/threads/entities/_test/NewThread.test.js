const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type spesification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION',
    );
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
