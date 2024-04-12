const PDFDocument = require('pdfkit');
// Removed the unused fs import

function sanitizeInput(input) {
    // Removes non-printable characters and other potential UTF-8 problematic characters
    return input.replace(/[^\x20-\x7E]/g, '');
}

function createPDFStream(formData) {
    const doc = new PDFDocument();

    formData.questionNumber.forEach((number, index) => {
        let question = sanitizeInput(formData.question[index]);
        let instruction = sanitizeInput(formData.instructions[index]);
        let marks = formData.marks[index];

        // Format for teacher's assessment
        doc.fontSize(12).text(`Question ${number}:`, { paragraphGap: 5 })
          .fontSize(12).text(`Question: ${question} (${marks} marks)`, { paragraphGap: 5 })
          .fontSize(12).text(`Instructions to marker:`, { paragraphGap: 5 })
          .text(`${instruction}`, { paragraphGap: 5, indent: 20 })
          .moveDown();
    });

    doc.end();
    return doc; // Return the document stream
}

module.exports = createPDFStream;
