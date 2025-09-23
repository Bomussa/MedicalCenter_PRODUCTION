const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Clinic = require('./models/Clinic');
const Exam = require('./models/Exam');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
// removed: // removed:   .then(() => console.log('MongoDB connected for migration'))
  .catch(err => console.error(err));

// Sample data from the frontend (extracted from the original files)
const initialUsers = [
  {
    username: 'bomussa',
    password: '12345',
    role: 'super_admin',
    isActive: true,
  },
];

const initialClinics = [
  {
    name_ar: 'إدارة العيادات',
    name_en: 'Clinic Management',
    floor: 'الطابق الأرضي',
    order: 1,
    isActive: true,
    pin: '1234',
  },
  {
    name_ar: 'عيادة العيون',
    name_en: 'Eye Clinic',
    floor: 'الطابق الثاني',
    order: 2,
    isActive: true,
    pin: '2345',
  },
  {
    name_ar: 'عيادة الباطنية',
    name_en: 'Internal Medicine',
    floor: 'الطابق الثاني',
    order: 3,
    isActive: true,
    pin: '3456',
  },
  {
    name_ar: 'المختبر',
    name_en: 'Laboratory',
    floor: 'الطابق الميزانين',
    order: 4,
    isActive: true,
    pin: '4567',
  },
  {
    name_ar: 'الأشعة',
    name_en: 'Radiology',
    floor: 'الطابق الأرضي',
    order: 5,
    isActive: true,
    pin: '5678',
  },
  {
    name_ar: 'عيادة القلب',
    name_en: 'Cardiology',
    floor: 'الطابق الثالث',
    order: 6,
    isActive: true,
    pin: '6789',
  },
];

const initialExams = [
  {
    name_ar: 'فحص الدورات التدريبية',
    name_en: 'Training Courses Exam',
    targetGender: 'both',
    clinicCount: 2,
    isActive: true,
  },
  {
    name_ar: 'فحص التجنيد والترفيع',
    name_en: 'Recruitment & Promotion Exam',
    targetGender: 'male',
    clinicCount: 3,
    isActive: true,
  },
  {
    name_ar: 'فحص الطيران السنوي',
    name_en: 'Annual Aviation Exam',
    targetGender: 'both',
    clinicCount: 2,
    isActive: true,
  },
];

async function migrateData() {
  try {
// removed: // removed:     console.log('Starting data migration...');

    // Clear existing data
    await User.deleteMany({});
    await Clinic.deleteMany({});
    await Exam.deleteMany({});
// removed: // removed:     console.log('Cleared existing data');

    // Migrate Users
// removed: // removed:     console.log('Migrating users...');
    for (const userData of initialUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      
      await user.save();
// removed: // removed:       console.log(`User ${userData.username} migrated successfully`);
    }

    // Migrate Clinics
// removed: // removed:     console.log('Migrating clinics...');
    const clinicIds = [];
    for (const clinicData of initialClinics) {
      const clinic = new Clinic(clinicData);
      await clinic.save();
      clinicIds.push(clinic._id);
// removed: // removed:       console.log(`Clinic ${clinicData.name_en} migrated successfully`);
    }

    // Migrate Exams
// removed: // removed:     console.log('Migrating exams...');
    for (let i = 0; i < initialExams.length; i++) {
      const examData = initialExams[i];
      
      // Assign clinics to exams (simplified logic)
      const assignedClinics = clinicIds.slice(0, examData.clinicCount).map((clinicId, index) => ({
        clinicId,
        order: index + 1,
      }));
      
      const exam = new Exam({
        ...examData,
        clinics: assignedClinics,
      });
      
      await exam.save();
// removed: // removed:       console.log(`Exam ${examData.name_en} migrated successfully`);
    }

// removed: // removed:     console.log('Data migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
