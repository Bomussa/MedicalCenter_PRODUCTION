const request = require('supertest');
const mongoose = require('mongoose');
const { createServer } = require("../server");
const app = createServer();
const User = require('../models/User');
const Exam = require('../models/Exam');
const Clinic = require('../models/Clinic');

describe('Exams API', () => {
  let authToken;
  let testExamId;
  let testClinicId;



  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Exam.deleteMany({});
    await Clinic.deleteMany({});
    
    // Create a test admin user
    const adminUser = new User({
      username: 'testadmin',
      password: 'hashedpassword123',
      role: 'super_admin',
      isActive: true
    });
    await adminUser.save();

    // Create a test clinic
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

    // Create a test exam
    const testExam = new Exam({
      name_ar: 'فحص اختبار',
      name_en: 'Test Exam',
      targetGender: 'both',
      clinicCount: 1,
      clinics: [{ clinicId: testClinicId, order: 1 }],
      isActive: true
    });
    await testExam.save();
    testExamId = testExam._id;

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

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/exams', () => {
    test('should get all exams with valid auth token', async () => {
      const response = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.exams).toBeInstanceOf(Array);
      expect(response.body.exams.length).toBeGreaterThan(0);
      expect(response.body.exams[0]).toHaveProperty("name_ar");
      expect(response.body.exams[0]).toHaveProperty("name_en");
      expect(response.body.exams[0]).toHaveProperty('targetGender');
    });

    test('should populate clinic information in exams', async () => {
      const response = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.exams[0].clinics).toBeInstanceOf(Array);
      expect(response.body.exams[0].clinics[0]).toHaveProperty('name_ar');
      expect(response.body.exams[0].clinics[0]).toHaveProperty('name_en');
    });

    test('should reject request without auth token', async () => {
      const response = await request(app)
        .get('/api/exams');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/exams', () => {
    test('should create new exam with valid data', async () => {
      const newExam = {
        name_ar: 'فحص جديد',
        name_en: 'New Exam',
        targetGender: 'male',
        clinics: [testClinicId]
      };

      const response = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newExam);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.exam).toHaveProperty("name_ar", "فحص جديد");
      expect(response.body.exam).toHaveProperty("name_en", "New Exam");
      expect(response.body.exam).toHaveProperty('targetGender', 'male');
      expect(response.body.exam).toHaveProperty('isActive', true);
      expect(response.body.exam.clinics).toBeInstanceOf(Array);
    });

    test('should reject exam with missing required fields', async () => {
      const incompleteExam = {
        name_ar: 'فحص ناقص'
        // missing nameEn, targetGender, clinics
      };

      const response = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteExam);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject exam with invalid target gender', async () => {
      const invalidExam = {
        name_ar: 'فحص غير صحيح',
        name_en: 'Invalid Exam',
        targetGender: 'invalid_gender',
        clinics: [testClinicId]
      };

      const response = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidExam);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject exam with invalid clinic IDs', async () => {
      const invalidExam = {
        name_ar: 'فحص غير صحيح',
        name_en: 'Invalid Exam',
        targetGender: 'both',
        clinics: ['invalidclinicid']
      };

      const response = await request(app)
        .post('/api/exams')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidExam);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject request without auth token', async () => {
      const newExam = {
        name_ar: 'فحص جديد',
        name_en: 'New Exam',
        targetGender: 'both',
        clinics: [testClinicId]
      };

      const response = await request(app)
        .post('/api/exams')
        .send(newExam);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/exams/:id', () => {
    test('should update exam with valid data', async () => {
      const updateData = {
        name_ar: 'فحص محدث',
        name_en: 'Updated Exam',
        targetGender: 'female'
      };

      const response = await request(app)
        .put(`/api/exams/${testExamId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.exam).toHaveProperty('name_ar', 'فحص محدث');
      expect(response.body.exam).toHaveProperty('name_en', 'Updated Exam');
      expect(response.body.exam).toHaveProperty('targetGender', 'female');
    });

    test('should reject update with invalid exam ID', async () => {
      const updateData = {
        nameAr: 'فحص محدث'
      };

      const response = await request(app)
        .put('/api/exams/invalidid')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject update without auth token', async () => {
      const updateData = {
        nameAr: 'فحص محدث'
      };

      const response = await request(app)
        .put(`/api/exams/${testExamId}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/exams/:id', () => {
    test('should delete exam with valid ID', async () => {
      const response = await request(app)
        .delete(`/api/exams/${testExamId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('تم حذف الفحص بنجاح');

      // Verify exam is deleted
      const getResponse = await request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(getResponse.body.exams.length).toBe(0);
    });

    test('should reject delete with invalid exam ID', async () => {
      const response = await request(app)
        .delete('/api/exams/invalidid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject delete without auth token', async () => {
      const response = await request(app)
        .delete(`/api/exams/${testExamId}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/exams/:id', () => {
    test('should get specific exam by ID', async () => {
      const response = await request(app)
        .get(`/api/exams/${testExamId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.exam).toHaveProperty('name_ar', 'فحص اختبار');
      expect(response.body.exam).toHaveProperty('name_en', 'Test Exam');
      expect(response.body.exam).toHaveProperty('targetGender', 'both');
    });

    test('should return 404 for non-existent exam', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/exams/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('الفحص غير موجود');
    });
  });

  describe('GET /api/exams/gender/:gender', () => {
    test('should get exams filtered by gender', async () => {
      // Create exams with different target genders
      const maleExam = new Exam({
        name_ar: 'فحص ذكور',
        name_en: 'Male Exam',
        targetGender: 'male',
        clinicCount: 1,
        clinics: [testClinicId],
        isActive: true
      });
      await maleExam.save();

      const femaleExam = new Exam({
        name_ar: 'فحص إناث',
        name_en: 'Female Exam',
        targetGender: 'female',
        clinicCount: 1,
        clinics: [testClinicId],
        isActive: true
      });
      await femaleExam.save();

      // Test male filter
      const maleResponse = await request(app)
        .get('/api/exams/gender/male')
        .set('Authorization', `Bearer ${authToken}`);

      expect(maleResponse.status).toBe(200);
      expect(maleResponse.body.success).toBe(true);
      expect(maleResponse.body.exams.length).toBeGreaterThan(0);
      
      // Should include 'both' and 'male' exams
      const targetGenders = maleResponse.body.exams.map(exam => exam.targetGender);
      expect(targetGenders).toContain('both');
      expect(targetGenders).toContain('male');
      expect(targetGenders).not.toContain('female');
    });

    test('should reject invalid gender parameter', async () => {
      const response = await request(app)
        .get('/api/exams/gender/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
