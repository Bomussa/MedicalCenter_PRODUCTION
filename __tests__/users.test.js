const request = require('supertest');
const mongoose = require('mongoose');
const { createServer } = require("../server");
const app = createServer();
const User = require('../models/User');

describe('Users API', () => {
  let authToken;
  let testUserId;



  beforeEach(async () => {
    // Clear users collection
    await User.deleteMany({});
    
    // Create a test admin user
    const adminUser = new User({
      username: 'testadmin',
      password: 'hashedpassword123',
      role: 'super_admin',
      isActive: true
    });
    await adminUser.save();
    testUserId = adminUser._id;

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testadmin',
        password: '12345',
        twoFA: '14490'
      });
    
    if (loginResponse.body.success) {
      authToken = loginResponse.body.token;
    }
  });



  describe('POST /api/users/login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testadmin',
          password: '12345',
          twoFA: '14490'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('username', 'testadmin');
      expect(response.body.user).toHaveProperty('role', 'super_admin');
      expect(response.body).toHaveProperty('token');
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'wronguser',
          password: 'wrongpass',
          twoFA: 'wrong2fa'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message');
    });

    test('should reject missing fields', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'testadmin'
          // missing password and twoFA
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users', () => {
    test('should get all users with valid auth token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.users).toBeInstanceOf(Array);
      expect(response.body.users.length).toBeGreaterThan(0);
    });

    test('should reject request without auth token', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should reject request with invalid auth token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/users', () => {
    test('should create new user with valid data', async () => {
      const newUser = {
        username: 'newuser',
        password: 'password123',
        role: 'admin'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('username', 'newuser');
      expect(response.body.user).toHaveProperty('role', 'admin');
      expect(response.body.user).toHaveProperty('isActive', true);
    });

    test('should reject duplicate username', async () => {
      const duplicateUser = {
        username: 'testadmin', // already exists
        password: 'password123',
        role: 'admin'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('موجود بالفعل');
    });

    test('should reject invalid role', async () => {
      const invalidUser = {
        username: 'invaliduser',
        password: 'password123',
        role: 'invalid_role'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject request without auth token', async () => {
      const newUser = {
        username: 'newuser',
        password: 'password123',
        role: 'admin'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update user with valid data', async () => {
      const updateData = {
        isActive: false
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('isActive', false);
    });

    test('should reject update with invalid user ID', async () => {
      const updateData = {
        isActive: false
      };

      const response = await request(app)
        .put('/api/users/invalidid')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject update without auth token', async () => {
      const updateData = {
        isActive: false
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should delete user with valid ID', async () => {
      // Create another user to delete
      const userToDelete = new User({
        username: 'usertodelete',
        password: 'hashedpassword123',
        role: 'admin',
        isActive: true
      });
      await userToDelete.save();

      const response = await request(app)
        .delete(`/api/users/${userToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('تم حذف المستخدم بنجاح');
    });

    test('should reject delete with invalid user ID', async () => {
      const response = await request(app)
        .delete('/api/users/invalidid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject delete without auth token', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUserId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
