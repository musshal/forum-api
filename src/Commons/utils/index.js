const mapThreadDbToModel = ({ id, title, publisher }) => ({
  id,
  title,
  owner: publisher,
});

const mapCommentDbToModel = ({ id, content, publisher }) => ({
  id,
  content,
  owner: publisher,
});

const getMapCommentDbToModel = ({
  id,
  date,
  content,
  is_delete,
  username,
}) => ({
  id,
  date,
  content,
  isDelete: is_delete,
  username,
});

const mapReplyDbToModel = ({ id, content, publisher }) => ({
  id,
  content,
  owner: publisher,
});

const getMapReplyDbToModel = ({
  id,
  comment_id,
  content,
  date,
  username,
  is_delete,
}) => ({
  id,
  commentId: comment_id,
  content,
  date,
  username,
  isDelete: is_delete,
});

const getMapLikeDbToModel = ({
  id, thread_id, comment_id, user_id,
}) => ({
  id,
  threadId: thread_id,
  commentId: comment_id,
  userId: user_id,
});

module.exports = {
  mapThreadDbToModel,
  mapCommentDbToModel,
  getMapCommentDbToModel,
  mapReplyDbToModel,
  getMapReplyDbToModel,
  getMapLikeDbToModel,
};
