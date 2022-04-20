const mapThreadDbToModel = ({ id, title, publisher }) => ({
  id,
  title,
  owner: publisher,
});

module.exports = mapThreadDbToModel;
