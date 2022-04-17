const mapThreadsDbToModel = ({
  id, title, body, date, publisher,
}) => ({
  id,
  title,
  body,
  date,
  username: publisher,
});

const mapCommentsDbToModel = ({
  id, publisher, date, content,
}) => ({
  id,
  username: publisher,
  date,
  content,
});

const mapRepliesDbToModel = ({
  id, comment_id, content, date, publisher,
}) => ({
  id,
  comment_id,
  username: publisher,
  date,
  content,
});

module.exports = {
  mapThreadsDbToModel,
  mapCommentsDbToModel,
  mapRepliesDbToModel,
};
