
const express = require("express");
const Exam = require("../models/Exam");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Exam management
 */

// Middleware for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware to verify JWT token (reused from users.js)
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "super_admin" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  next();
};

/**
 * @swagger
 * /api/exams:
 *   get:
 *     summary: Get all exams with pagination
 *     tags: [Exams]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page (default is 10)
 *     responses:
 *       200:
 *         description: A paginated list of exams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 exams:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Exam"
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const exams = await Exam.find()
      .populate("clinics.clinicId")
      .skip(skip)
      .limit(limit);

    const totalExams = await Exam.countDocuments();

    res.json({
      success: true,
      exams,
      totalPages: Math.ceil(totalExams / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @swagger
 * /api/exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The exam ID
 *     responses:
 *       200:
 *         description: Exam data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 exam:
 *                   $ref: "#/components/schemas/Exam"
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("clinics.clinicId");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @swagger
 * /api/exams:
 *   post:
 *     summary: Create a new exam (Admin only)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewExam"
 *     responses:
 *       201:
 *         description: Exam created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 exam:
 *                   $ref: "#/components/schemas/Exam"
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  [
    body("name_ar").notEmpty().withMessage("Arabic name is required"),
    body("name_en").notEmpty().withMessage("English name is required"),
    body("targetGender").isIn(["male", "female", "both"]).withMessage("Invalid target gender"),
    body("clinicCount").isInt({ min: 0 }).withMessage("Clinic count must be a non-negative integer"),
    body("clinics").isArray().withMessage("Clinics must be an array"),
    body("clinics.*.clinicId").isMongoId().withMessage("Invalid Clinic ID"),
    body("clinics.*.order").isInt({ min: 0 }).withMessage("Clinic order must be a non-negative integer"),
  ],
  validate,
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { name_ar, name_en, targetGender, clinicCount, clinics } = req.body;

      const newExam = new Exam({
        name_ar,
        name_en,
        targetGender,
        clinicCount,
        clinics: clinics || [],
      });

      await newExam.save();
      res.status(201).json({
        success: true,
        message: "Exam created successfully",
        exam: newExam,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

/**
 * @swagger
 * /api/exams/{id}:
 *   put:
 *     summary: Update an exam (Admin only)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateExam"
 *     responses:
 *       200:
 *         description: Exam updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 exam:
 *                   $ref: "#/components/schemas/Exam"
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  [
    body("name_ar").notEmpty().withMessage("Arabic name is required"),
    body("name_en").notEmpty().withMessage("English name is required"),
    body("targetGender").isIn(["male", "female", "both"]).withMessage("Invalid target gender"),
    body("clinicCount").isInt({ min: 0 }).withMessage("Clinic count must be a non-negative integer"),
    body("clinics").isArray().withMessage("Clinics must be an array"),
    body("clinics.*.clinicId").isMongoId().withMessage("Invalid Clinic ID"),
    body("clinics.*.order").isInt({ min: 0 }).withMessage("Clinic order must be a non-negative integer"),
    body("isActive").isBoolean().withMessage("isActive must be a boolean"),
  ],
  validate,
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { name_ar, name_en, targetGender, clinicCount, clinics, isActive } = req.body;

      const exam = await Exam.findByIdAndUpdate(
        req.params.id,
        { name_ar, name_en, targetGender, clinicCount, clinics, isActive },
        { new: true }
      ).populate("clinics.clinicId");

      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      res.json({
        success: true,
        message: "Exam updated successfully",
        exam,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

/**
 * @swagger
 * /api/exams/{id}:
 *   delete:
 *     summary: Delete an exam (Admin only)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The exam ID
 *     responses:
 *       200:
 *         description: Exam deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const exam = await Exam.findByIdAndDelete(req.params.id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      res.json({ success: true, message: "Exam deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

/**
 * @swagger
 * /api/exams/gender/{gender}:
 *   get:
 *     summary: Get exams filtered by gender
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, both]
 *         required: true
 *         description: The target gender for exams
 *     responses:
 *       200:
 *         description: A list of exams filtered by gender
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 exams:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Exam"
 *       400:
 *         description: Invalid gender parameter
 *       500:
 *         description: Server error
 */
router.get(
  "/gender/:gender",
  [param("gender").isIn(["male", "female", "both"]).withMessage("Invalid gender parameter.")],
  validate,
  verifyToken,
  async (req, res) => {
    try {
      const { gender } = req.params;

      const exams = await Exam.find({
        $or: [{ targetGender: gender }, { targetGender: "both" }],
      }).populate("clinics.clinicId");

      res.json({ success: true, exams });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
);

module.exports = router;

