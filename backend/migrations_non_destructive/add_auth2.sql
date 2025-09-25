-- غير هدّامي: إنشاء جداول جديدة للصلاحيات دون المساس بالقديم
CREATE TABLE IF NOT EXISTS "User2"(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN','ADMIN')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- إدراج المستخدمين الافتراضيين
-- SUPER_ADMIN
INSERT OR IGNORE INTO "User2"(username, passwordHash, role)
VALUES (
  'bomussa',
  '$2a$10$UiQej.RvLC.jRgoO/DbOQOS9P7W3R0v9gOOrFIf6lZhhtxeI0C2Q6', -- كلمة مرور 14490
  'SUPER_ADMIN'
);

-- ADMIN
INSERT OR IGNORE INTO "User2"(username, passwordHash, role)
VALUES (
  'admin',
  '$2a$10$UiQej.RvLC.jRgoO/DbOQOS9P7W3R0v9gOOrFIf6lZhhtxeI0C2Q6', -- كلمة مرور 14490
  'ADMIN'
);

