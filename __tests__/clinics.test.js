const request = require('supertest');
const mongoose = require('mongoose');
const { createServer } = require("../server");
const app = createServer();
const User = require('../models/User');
const Clinic = require('../models/Clinic');

describe('Clinics API', () => {
  let authToken;
  let testClinicId;



  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Clinic.deleteMany({});
    
    // Create a test admin user
    const adminUser = new User({
      username: 'testadmin',
      password: 'hashedpassword123',
      role: 'super_admin',
      isActive: true
    });
    await adminUser.save();

    const testClinic = new Clinic({
      name_ar: 'عيادة اختبار',
      name_en: 'Test Clinic',
      floor: 'الطابق الأول',
      order: 1,
      pin: '1234',
      isActive: true
    });
    await testClinic.save();
    testClinicId = testClinic._id;

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



  describe('GET /api/clinics', () => {
    test('should get all clinics with valid auth token', async () => {
      const response = await request(app)
        .get('/api/clinics')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.clinics).toBeInstanceOf(Array);
      expect(response.body.clinics.length).toBeGreaterThan(0);
      expect(response.body.clinics[0]).toHaveProperty("name_ar");
      expect(response.body.clinics[0]).toHaveProperty("name_en");
    });

    test('should reject request without auth token', async () => {
      const response = await request(app)
        .get('/api/clinics');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/clinics', () => {
    test('should create new clinic with valid data', async () => {
      const newClinic = {
        name_ar: 'عيادة جديدة',
        name_en: 'New Clinic',
        floor: 'الطابق الثاني',
        order: 2,
        pin: '5678'
      };

      const response = await request(app)
        .post('/api/clinics')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newClinic);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.clinic).toHaveProperty("name_ar", "عيادة جديدة");
      expect(response.body.clinic).toHaveProperty("name_en", "New Clinic");
      expect(response.body.clinic).toHaveProperty('floor', 'الطابق الثاني');
      expect(response.body.clinic).toHaveProperty('order', 2);
      expect(response.body.clinic).toHaveProperty('pin', '5678');
      expect(response.body.clinic).toHaveProperty('isActive', true);
    });

    test('should reject clinic with missing required fields', async () => {
      const incompleteClinic = {
        name_ar: 'عيادة ناقصة'
        // missing nameEn, floor, order, pin
      };

      const response = await request(app)
        .post('/api/clinics')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteClinic);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject duplicate clinic order', async () => {
      const duplicateOrderClinic = {
        name_ar: 'عيادة مكررة',
        name_en: 'Duplicate Clinic',
        floor: 'الطابق الأول',
        order: 1, // same as existing clinic
        pin: '9999'
      };

      const response = await request(app)
        .post('/api/clinics')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateOrderClinic);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('ترتيب العيادة موجود بالفعل');
    });

    test('should reject request without auth token', async () => {
      const newClinic = {
        name_ar: 'عيادة جديدة',
        name_en: 'New Clinic',
        floor: 'الطابق الثاني',
        order: 2,
        pin: '5678'
      };

      const response = await request(app)
        .post('/api/clinics')
        .send(newClinic);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/clinics/:id', () => {
    test('should update clinic with valid data', async () => {
      const updateData = {
        name_ar: 'عيادة محدثة',
        name_en: 'Updated Clinic',
        floor: 'الطابق الثالث'
      };

      const response = await request(app)
        .put(`/api/clinics/${testClinicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.clinic).toHaveProperty('nameAr', 'عيادة محدثة');
      expect(response.body.clinic).toHaveProperty('nameEn', 'Updated Clinic');
      expect(response.body.clinic).toHaveProperty('floor', 'الطابق الثالث');
    });

    test('should reject update with invalid clinic ID', async () => {
      const updateData = {
        nameAr: 'عيادة محدثة'
      };

      const response = await request(app)
        .put('/api/clinics/invalidid')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject update without auth token', async () => {
      const updateData = {
        nameAr: 'عيادة محدثة'
      };

      const response = await request(app)
        .put(`/api/clinics/${testClinicId}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/clinics/:id', () => {
    test('should delete clinic with valid ID', async () => {
      const response = await request(app)
        .delete(`/api/clinics/${testClinicId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('تم حذف العيادة بنجاح');

      // Verify clinic is deleted
      const getResponse = await request(app)
        .get('/api/clinics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(getResponse.body.clinics.length).toBe(0);
    });

    test('should reject delete with invalid clinic ID', async () => {
      const response = await request(app)
        .delete('/api/clinics/invalidid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject delete without auth token', async () => {
      const response = await request(app)
        .delete(`/api/clinics/${testClinicId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/clinics/:id', () => {
    test('should get specific clinic by ID', async () => {
      const response = await request(app)
        .get(`/api/clinics/${testClinicId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.clinic).toHaveProperty('nameAr', 'عيادة اختبار');
      expect(response.body.clinic).toHaveProperty('nameEn', 'Test Clinic');
    });

    test('should return 404 for non-existent clinic', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/clinics/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('العيادة غير موجودة');
    });
  });
});
