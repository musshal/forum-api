/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const AuthenticationsTableTestHelper = require('./AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTesthelper = {
  async getAccessToken() {
    const payloadUser = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    await UsersTableTestHelper.addUser(payloadUser);

    const accessToken = Jwt.token.generate(
      payloadUser,
      process.env.ACCESS_TOKEN_KEY,
    );
    const refreshToken = Jwt.token.generate(
      payloadUser,
      process.env.REFRESH_TOKEN_KEY,
    );

    await AuthenticationsTableTestHelper.addToken(refreshToken);

    return accessToken;
  },

  async cleanTable() {
    AuthenticationsTableTestHelper.cleanTable();
    UsersTableTestHelper.cleanTable();
  },
};

module.exports = ServerTesthelper;
