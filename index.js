const express = require('express');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/generate-qr', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`QR Code generator server running on port ${PORT}`);
});