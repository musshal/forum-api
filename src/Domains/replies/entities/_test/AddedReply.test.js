const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'sebuah balasan',
      owner: {},
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION',
    );
  });

  it('should create addedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
