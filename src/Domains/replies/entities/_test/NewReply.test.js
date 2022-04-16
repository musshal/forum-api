const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error if payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan',
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type spesification', () => {
    // Arrange
    const payload = {
      content: {},
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION',
    );
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      owner: 'user-123',
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply).toBeInstanceOf(NewReply);
    expect(newReply.content).toEqual(payload.content);
    expect(newReply.owner).toEqual(payload.owner);
  });
});
