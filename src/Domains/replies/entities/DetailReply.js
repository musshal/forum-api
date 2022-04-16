class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, isDelete,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.isDelete = isDelete;
  }

  _verifyPayload(payload) {
    const {
      id, content, date, username, isDelete,
    } = payload;

    if (!id || !content || !date || !username || isDelete === undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof isDelete !== 'boolean'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION');
    }
  }
}

module.exports = DetailReply;
