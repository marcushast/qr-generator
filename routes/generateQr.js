const express = require('express');
const QRCode = require('qrcode');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     QRRequest:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           description: The text to encode in the QR code
 *       example:
 *         text: "Hello World"
 *     QRResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the QR code generation was successful
 *         qrCode:
 *           type: string
 *           description: Base64 encoded QR code image data URL
 *         text:
 *           type: string
 *           description: The original text that was encoded
 *       example:
 *         success: true
 *         qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *         text: "Hello World"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         error: "Text parameter is required"
 */

/**
 * @swagger
 * /generate-qr:
 *   post:
 *     summary: Generate a QR code from text
 *     description: Creates a QR code image from the provided text and returns it as a base64 data URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QRRequest'
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QRResponse'
 *       400:
 *         description: Bad request - missing or invalid text parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error - failed to generate QR code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/generate-qr', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }
    
    const qrCodeDataURL = await QRCode.toDataURL(text);
    
    res.json({
      success: true,
      qrCode: qrCodeDataURL,
      text: text
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

module.exports = router;