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
  mapRepliesDbToModel,
};
