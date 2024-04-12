const express = require('express');
const multer = require('multer');
const createPDFStream = require('./generatePDF'); // Updated to match the new function name
const createDOCXBuffer = require('./createDOCXBuffer'); // Assume this generates a DOCX buffer

const app = express();
const port = process.env.PORT || 3000;
const upload = multer(); // Set up multer for handling form data

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Route to handle form submission
app.post('/submit-form', upload.none(), (req, res) => {
    const isStudentAssessment = req.body.type === 'student';

    if (isStudentAssessment) {
        // Generate DOCX and stream to client
        createDOCXBuffer(req.body, (err, buffer) => {
            if (err) {
                console.error('Error generating DOCX:', err);
                return res.status(500).send('Error generating DOCX');
            }
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', 'attachment; filename=Student-Assessment.docx');
            res.send(buffer);
        });
    } else {
        // Stream PDF directly to client
        const docStream = createPDFStream(req.body);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Teacher-Assessment.pdf');
        docStream.pipe(res); // Pipe the PDF stream to the response
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
