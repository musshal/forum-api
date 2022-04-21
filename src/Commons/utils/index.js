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

module.exports = { mapThreadDbToModel, mapCommentDbToModel };
