const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      content: 'sebuah comment',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: {},
      date: 2022,
      replies: 'sebuah balasan',
      content: {},
      likeCount: 0,
      isDelete: false,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION',
    );
  });

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2022-04-14T00:41:09.775Z',
      replies: [],
      content: 'sebuah comment',
      likeCount: 0,
      isDelete: false,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.replies).toEqual(payload.replies);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.likeCount).toEqual(payload.likeCount);
    expect(detailComment.isDelete).toEqual(payload.isDelete);
  });
});
