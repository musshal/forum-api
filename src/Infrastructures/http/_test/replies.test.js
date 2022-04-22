const pool = require('../../database/postgres/pool');
const RepliesTablerTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTesthelper = require('../../../../tests/ServerTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTablerTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ServerTesthelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted addedReply', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan',
      };

      const accessToken = await ServerTesthelper.getAccessToken({});

      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.owner).toEqual('user-123');
    });

    it('should response 400 when request payload did not contain needed property', async () => {
      // Arrange
      const requestPayload = {};

      const accessToken = await ServerTesthelper.getAccessToken({});

      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 when request payload did not meet data type spesification', async () => {
      // Arrange
      const requestPayload = {
        content: {},
      };

      const accessToken = await ServerTesthelper.getAccessToken({});

      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when request payload did not contain auth', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson).toBeDefined();
    });
  });
});
