
const express = require("express");
const Clinic = require("../models/Clinic");
const router = express.Router();
const { body, validationResult } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Clinics
 *   description: Clinic management
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
 * /api/clinics:
 *   get:
 *     summary: Get all clinics with pagination
 *     tags: [Clinics]
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
 *         description: A paginated list of clinics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clinics:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Clinic"
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

    const clinics = await Clinic.find()
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit);

    const totalClinics = await Clinic.countDocuments();

    res.json({
      clinics,
      totalPages: Math.ceil(totalClinics / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @swagger
 * /api/clinics/{id}:
 *   get:
 *     summary: Get clinic by ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clinic ID
 *     responses:
 *       200:
 *         description: Clinic data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Clinic"
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @swagger
 * /api/clinics:
 *   post:
 *     summary: Create a new clinic (Admin only)
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewClinic"
 *     responses:
 *       201:
 *         description: Clinic created successfully
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
    body("floor").notEmpty().withMessage("Floor is required"),
    body("order").isInt({ min: 0 }).withMessage("Order must be a non-negative integer"),
    body("pin").optional().isString().withMessage("PIN must be a string"),
  ],
  validate,
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { name_ar, name_en, floor, order, pin } = req.body;

      const newClinic = new Clinic({
        name_ar,
        name_en,
        floor,
        order,
        pin,
      });

      await newClinic.save();
      res.status(201).json({
        message: "Clinic created successfully",
        clinic: newClinic,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

/**
 * @swagger
 * /api/clinics/{id}:
 *   put:
 *     summary: Update a clinic (Admin only)
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clinic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateClinic"
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  [
    body("name_ar").notEmpty().withMessage("Arabic name is required"),
    body("name_en").notEmpty().withMessage("English name is required"),
    body("floor").notEmpty().withMessage("Floor is required"),
    body("order").isInt({ min: 0 }).withMessage("Order must be a non-negative integer"),
    body("pin").optional().isString().withMessage("PIN must be a string"),
    body("isActive").isBoolean().withMessage("isActive must be a boolean"),
  ],
  validate,
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { name_ar, name_en, floor, order, pin, isActive } = req.body;

      const clinic = await Clinic.findByIdAndUpdate(
        req.params.id,
        { name_ar, name_en, floor, order, pin, isActive },
        { new: true }
      );

      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }

      res.json({
        message: "Clinic updated successfully",
        clinic,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

/**
 * @swagger
 * /api/clinics/{id}:
 *   delete:
 *     summary: Delete a clinic (Admin only)
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clinic ID
 *     responses:
 *       200:
 *         description: Clinic deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const clinic = await Clinic.findByIdAndDelete(req.params.id);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }

      res.json({ message: "Clinic deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;

