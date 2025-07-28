# QR Code Generator

A simple Express.js server for generating QR codes via REST API.

## Features

- Generate QR codes from text input
- RESTful API endpoint
- Returns QR codes as base64 data URLs
- JSON response format
- Error handling and validation

## Installation

1. Clone the repository:
```bash
git clone https://github.com/marcushast/qr-generator.git
cd qr-generator
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

The server will run on port 3000 by default (or the port specified in the `PORT` environment variable).

2. Generate a QR code by sending a POST request to `/generate-qr`:

```bash
curl -X POST http://localhost:3000/generate-qr \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, World!"}'
```

### API Endpoint

**POST** `/generate-qr`

**Request Body:**
```json
{
  "text": "Your text to encode"
}
```

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "text": "Your text to encode"
}
```

**Error Response:**
```json
{
  "error": "Text parameter is required"
}
```

## Example Usage

### JavaScript/Fetch
```javascript
fetch('http://localhost:3000/generate-qr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'https://example.com'
  })
})
.then(response => response.json())
.then(data => {
  // Use data.qrCode as src for an img element
  console.log(data.qrCode);
});
```

## Dependencies

- [Express.js](https://expressjs.com/) - Web framework
- [qrcode](https://www.npmjs.com/package/qrcode) - QR code generation library

## Environment Variables

- `PORT` - Server port (default: 3000)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request