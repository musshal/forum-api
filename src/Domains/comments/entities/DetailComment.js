class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, replies, content, likeCount, isDelete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.content = content;
    this.likeCount = likeCount;
    this.isDelete = isDelete;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, replies, content, likeCount, isDelete,
    } = payload;

    if (
      !id
      || !username
      || !date
      || !replies
      || !content
      || likeCount === undefined
      || isDelete === undefined
    ) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof replies !== 'object'
      || typeof content !== 'string'
      || typeof likeCount !== 'number'
      || typeof isDelete !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = DetailComment;
