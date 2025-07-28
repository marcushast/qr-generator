const express = require('express');
const QRCode = require('qrcode');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const generateQrRouter = require('./routes/generateQr');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QR Code Generator API',
      version: '1.0.0',
      description: 'A simple API to generate QR codes from text',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/generateQr.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the generate-qr routes
app.use('/', generateQrRouter);

app.get('/', (req, res) => {
  res.redirect('/qr-generator');
});

app.get('/qr-generator', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code Generator</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #333; 
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input[type="text"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        input[type="text"]:focus {
            border-color: #007bff;
            outline: none;
        }
        button {
            background: #007bff;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        button:hover {
            background: #0056b3;
        }
        .result {
            margin-top: 30px;
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .qr-code {
            margin: 20px 0;
        }
        .links {
            margin-top: 30px;
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .links a {
            color: #007bff;
            text-decoration: none;
            margin: 0 15px;
        }
        .links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>QR Code Generator</h1>
        <form method="POST" action="/qr-generator">
            <div class="form-group">
                <label for="text">Enter text to generate QR code:</label>
                <input type="text" id="text" name="text" placeholder="Enter your text here..." required>
            </div>
            <button type="submit">Generate QR Code</button>
        </form>
        
        <div class="links">
            <a href="/api-docs">API Documentation</a>
            <a href="/">Home</a>
        </div>
    </div>
</body>
</html>`;
  res.send(html);
});

app.post('/qr-generator', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code Generator - Error</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .error { color: #dc3545; text-align: center; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error">
            <h2>Error</h2>
            <p>Text parameter is required</p>
            <p><a href="/qr-generator">← Go back</a></p>
        </div>
    </div>
</body>
</html>`);
    }
    
    const qrCodeDataURL = await QRCode.toDataURL(text);
    
    const resultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code Generator - Result</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #333; 
            text-align: center;
            margin-bottom: 30px;
        }
        .result {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .qr-code {
            margin: 20px 0;
        }
        .text-display {
            background: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            word-break: break-all;
        }
        .links {
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .links a {
            color: #007bff;
            text-decoration: none;
            margin: 0 15px;
        }
        .links a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>QR Code Generated Successfully!</h1>
        <div class="result">
            <div class="qr-code">
                <img src="${qrCodeDataURL}" alt="Generated QR Code" style="max-width: 100%; height: auto;">
            </div>
            <div class="text-display">
                <strong>Text encoded:</strong><br>
                ${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </div>
        </div>
        
        <div class="links">
            <a href="/qr-generator">← Generate Another</a>
            <a href="/api-docs">API Documentation</a>
            <a href="/">Home</a>
        </div>
    </div>
</body>
</html>`;
    
    res.send(resultHtml);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code Generator - Error</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .error { color: #dc3545; text-align: center; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error">
            <h2>Error</h2>
            <p>Failed to generate QR code</p>
            <p><a href="/qr-generator">← Go back</a></p>
        </div>
    </div>
</body>
</html>`);
  }
});


app.listen(PORT, () => {
  console.log(`QR Code generator server running on port ${PORT}`);
});