const mapThreadsDbToModel = ({
  id,
  title,
  body,
  date,
  username,
  comments,
}) => ({
  id,
  title,
  body,
  date,
  username,
  comments,
});

const mapCommentsDbToModel = ({
  id, username, date, content, replies,
}) => ({
  id,
  username,
  date,
  content,
  replies,
});

const mapReplies = ({
  id, commentId, username, date, content,
}) => ({
  id,
  commentId,
  username,
  date,
  content,
});

const mapRepliesDbToModel = ({
  id, comment_id, username, date, content,
}) => ({
  id,
  commentId: comment_id,
  username,
  date,
  content,
});

module.exports = {
  mapThreadsDbToModel,
  mapCommentsDbToModel,
  mapReplies,
  mapRepliesDbToModel,
};
