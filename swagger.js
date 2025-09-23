
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AttarMedical Backend API",
      version: "1.0.0",
      description:
        "API documentation for the AttarMedical Backend project, providing services for managing users, clinics, and medical exams.",
    },
    servers: [
      {
        url: "http://localhost:5000", // Adjust this based on your deployment
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated ID of the user",
            },
            username: {
              type: "string",
              description: "The username of the user",
            },
            role: {
              type: "string",
              enum: ["super_admin", "admin", "viewer", "analytics_manager"],
              description: "The role of the user",
            },
            isActive: {
              type: "boolean",
              description: "Whether the user account is active",
            },
            isTwoFactorEnabled: {
              type: "boolean",
              description: "Whether two-factor authentication is enabled for the user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the user was created",
            },
          },
          example: {
            _id: "60d0fe4f5e3676001c1f8e10",
            username: "testuser",
            role: "viewer",
            isActive: true,
            isTwoFactorEnabled: false,
            createdAt: "2023-01-01T12:00:00Z",
          },
        },
        NewUser: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              description: "The username for the new user",
            },
            password: {
              type: "string",
              description: "The password for the new user (min 6 characters)",
            },
            role: {
              type: "string",
              enum: ["super_admin", "admin", "viewer", "analytics_manager"],
              description: "The role of the new user (defaults to viewer)",
            },
          },
          example: {
            username: "newuser",
            password: "securepassword",
            role: "viewer",
          },
        },
        UpdateUserStatus: {
          type: "object",
          required: ["isActive"],
          properties: {
            isActive: {
              type: "boolean",
              description: "The new status of the user account (true for active, false for inactive)",
            },
          },
          example: {
            isActive: false,
          },
        },
        Clinic: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated ID of the clinic",
            },
            name_ar: {
              type: "string",
              description: "Clinic name in Arabic",
            },
            name_en: {
              type: "string",
              description: "Clinic name in English",
            },
            floor: {
              type: "string",
              description: "Floor where the clinic is located",
            },
            order: {
              type: "integer",
              description: "Display order of the clinic",
            },
            pin: {
              type: "string",
              description: "PIN for the clinic (optional)",
            },
            isActive: {
              type: "boolean",
              description: "Whether the clinic is active",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the clinic was created",
            },
          },
          example: {
            _id: "60d0fe4f5e3676001c1f8e11",
            name_ar: "عيادة الأسنان",
            name_en: "Dental Clinic",
            floor: "الطابق الأول",
            order: 1,
            pin: "1234",
            isActive: true,
            createdAt: "2023-01-01T12:00:00Z",
          },
        },
        NewClinic: {
          type: "object",
          required: ["name_ar", "name_en", "floor", "order"],
          properties: {
            name_ar: {
              type: "string",
              description: "Clinic name in Arabic",
            },
            name_en: {
              type: "string",
              description: "Clinic name in English",
            },
            floor: {
              type: "string",
              description: "Floor where the clinic is located",
            },
            order: {
              type: "integer",
              description: "Display order of the clinic",
            },
            pin: {
              type: "string",
              description: "PIN for the clinic (optional)",
            },
          },
          example: {
            name_ar: "عيادة جديدة",
            name_en: "New Clinic",
            floor: "الطابق الثاني",
            order: 2,
            pin: "5678",
          },
        },
        UpdateClinic: {
          type: "object",
          properties: {
            name_ar: {
              type: "string",
              description: "Clinic name in Arabic",
            },
            name_en: {
              type: "string",
              description: "Clinic name in English",
            },
            floor: {
              type: "string",
              description: "Floor where the clinic is located",
            },
            order: {
              type: "integer",
              description: "Display order of the clinic",
            },
            pin: {
              type: "string",
              description: "PIN for the clinic (optional)",
            },
            isActive: {
              type: "boolean",
              description: "Whether the clinic is active",
            },
          },
          example: {
            name_ar: "عيادة محدثة",
            name_en: "Updated Clinic",
            floor: "الطابق الثالث",
            order: 3,
            pin: "9101",
            isActive: false,
          },
        },
        Exam: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated ID of the exam",
            },
            name_ar: {
              type: "string",
              description: "Exam name in Arabic",
            },
            name_en: {
              type: "string",
              description: "Exam name in English",
            },
            targetGender: {
              type: "string",
              enum: ["male", "female", "both"],
              description: "Target gender for the exam",
            },
            clinicCount: {
              type: "integer",
              description: "Number of clinics associated with this exam",
            },
            clinics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  clinicId: {
                    type: "string",
                    description: "ID of the associated clinic",
                  },
                  order: {
                    type: "integer",
                    description: "Order of the clinic within the exam",
                  },
                },
              },
              description: "List of clinics associated with the exam",
            },
            isActive: {
              type: "boolean",
              description: "Whether the exam is active",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date and time the exam was created",
            },
          },
          example: {
            _id: "60d0fe4f5e3676001c1f8e12",
            name_ar: "فحص دم",
            name_en: "Blood Test",
            targetGender: "both",
            clinicCount: 2,
            clinics: [
              { clinicId: "60d0fe4f5e3676001c1f8e11", order: 1 },
              { clinicId: "60d0fe4f5e3676001c1f8e13", order: 2 },
            ],
            isActive: true,
            createdAt: "2023-01-01T12:00:00Z",
          },
        },
        NewExam: {
          type: "object",
          required: ["name_ar", "name_en", "targetGender", "clinicCount", "clinics"],
          properties: {
            name_ar: {
              type: "string",
              description: "Exam name in Arabic",
            },
            name_en: {
              type: "string",
              description: "Exam name in English",
            },
            targetGender: {
              type: "string",
              enum: ["male", "female", "both"],
              description: "Target gender for the exam",
            },
            clinicCount: {
              type: "integer",
              description: "Number of clinics associated with this exam",
            },
            clinics: {
              type: "array",
              items: {
                type: "object",
                required: ["clinicId", "order"],
                properties: {
                  clinicId: {
                    type: "string",
                    description: "ID of the associated clinic",
                  },
                  order: {
                    type: "integer",
                    description: "Order of the clinic within the exam",
                  },
                },
              },
              description: "List of clinics associated with the exam",
            },
          },
          example: {
            name_ar: "فحص بول",
            name_en: "Urine Test",
            targetGender: "female",
            clinicCount: 1,
            clinics: [
              { clinicId: "60d0fe4f5e3676001c1f8e14", order: 1 },
            ],
          },
        },
        UpdateExam: {
          type: "object",
          properties: {
            name_ar: {
              type: "string",
              description: "Exam name in Arabic",
            },
            name_en: {
              type: "string",
              description: "Exam name in English",
            },
            targetGender: {
              type: "string",
              enum: ["male", "female", "both"],
              description: "Target gender for the exam",
            },
            clinicCount: {
              type: "integer",
              description: "Number of clinics associated with this exam",
            },
            clinics: {
              type: "array",
              items: {
                type: "object",
                required: ["clinicId", "order"],
                properties: {
                  clinicId: {
                    type: "string",
                    description: "ID of the associated clinic",
                  },
                  order: {
                    type: "integer",
                    description: "Order of the clinic within the exam",
                  },
                },
              },
              description: "List of clinics associated with the exam",
            },
            isActive: {
              type: "boolean",
              description: "Whether the exam is active",
            },
          },
          example: {
            name_ar: "فحص شامل",
            name_en: "Comprehensive Checkup",
            targetGender: "both",
            clinicCount: 3,
            clinics: [
              { clinicId: "60d0fe4f5e3676001c1f8e11", order: 1 },
              { clinicId: "60d0fe4f5e3676001c1f8e13", order: 2 },
              { clinicId: "60d0fe4f5e3676001c1f8e14", order: 3 },
            ],
            isActive: false,
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

