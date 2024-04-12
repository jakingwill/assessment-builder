const { Document, Packer, Paragraph, TextRun } = require('docx');

function createDOCXBuffer(formData, callback) {
    const doc = new Document({
        sections: formData.questionNumber.map((number, index) => {
            let question = formData.question[index];
            let marks = formData.marks[index];

            return {
                properties: {},
                children: [
                    new Paragraph({
                        children: [new TextRun(`Question ${number}`)],
                    }),
                    new Paragraph({
                        children: [new TextRun(`Question: ${question} (${marks} marks)`)],
                    }),
                    new Paragraph({
                        children: [new TextRun("Answer: ")],
                    }),
                    // The empty Paragraph with just a space may not be necessary unless you want to ensure a visual gap.
                    new Paragraph({
                        children: [new TextRun(" ")],
                    }),
                ],
            };
        }),
    });

    // Used to export the document into a buffer instead of a file
    Packer.toBuffer(doc).then(buffer => {
        callback(null, buffer); // Callback with the buffer
    }).catch(err => {
        console.error(err);
        callback(err, null); // Callback with error
    });
}

module.exports = createDOCXBuffer;
