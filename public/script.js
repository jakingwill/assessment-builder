// script.js

// Function to navigate between sections
function navigateSections(direction) {
    const container = document.getElementById('sectionsContainer');
    const currentScroll = container.scrollLeft;
    const sectionWidth = container.querySelector('.question-block') ? container.querySelector('.question-block').offsetWidth : 0;
    container.scrollTo({ left: currentScroll + direction * (sectionWidth + 20), behavior: 'smooth' }); // Added 20 for margin
}

// Function to add a new question to the form
function addQuestion() {
    const sectionsContainer = document.getElementById('sectionsContainer');

    const topLineDiv = document.createElement('div');
    topLineDiv.className = 'top-line';

    // Question Number
    const questionNumberDiv = document.createElement('div');
    const questionNumberLabel = document.createElement('label');
    questionNumberLabel.textContent = 'Question Number (e.g. 1.1):';
    const questionNumberInput = document.createElement('input');
    questionNumberInput.type = 'text';
    questionNumberInput.name = 'questionNumber[]';
    questionNumberDiv.appendChild(questionNumberLabel);
    questionNumberDiv.appendChild(questionNumberInput);

    // Marks
    const marksDiv = document.createElement('div');
    const marksLabel = document.createElement('label');
    marksLabel.textContent = 'Marks:';
    const marksInput = document.createElement('input');
    marksInput.type = 'number';
    marksInput.name = 'marks[]';
    marksInput.min = 0;
    marksDiv.appendChild(marksLabel);
    marksDiv.appendChild(marksInput);

    topLineDiv.appendChild(questionNumberDiv);
    topLineDiv.appendChild(marksDiv);

    // Question Text
    const questionLabel = document.createElement('label');
    questionLabel.textContent = 'Question:';
    const questionTextarea = document.createElement('textarea');
    questionTextarea.name = 'question[]';

    // Instructions
    const instructionsLabel = document.createElement('label');
    instructionsLabel.textContent = 'Instructions to Marker:';
    const instructionsTextarea = document.createElement('textarea');
    instructionsTextarea.name = 'instructions[]';

  // Create the remove button
  const removeButton = document.createElement('a');
  removeButton.href = 'javascript:void(0);'; // Hyperlink with no action
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-button'; // Add a class for styling
  removeButton.onclick = function() {
      this.parentNode.remove(); // Removes the question block
  };

  questionNumberInput.addEventListener('input', function() {
      const validFormat = /^\d+\.\d+$/; // Regex for one number, a decimal, and another number
      if (!validFormat.test(this.value)) {
          this.setCustomValidity("Please use a number with one decimal eg. 1.1");
          this.reportValidity();
      } else {
          this.setCustomValidity("");
      }
  });
  
    // Assemble the question block
    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block';
    questionBlock.append(topLineDiv, questionLabel, questionTextarea, instructionsLabel, instructionsTextarea, removeButton);

  

    sectionsContainer.appendChild(questionBlock);
}

// Optional: Initialize with one question block
document.addEventListener('DOMContentLoaded', function() {
    addQuestion();
});

  // Function to check if any field in the question block is empty
  function isAnyFieldEmpty() {
      const questionNumbers = document.querySelectorAll('input[name="questionNumber[]"]');
      const questions = document.querySelectorAll('textarea[name="question[]"]');
      const instructions = document.querySelectorAll('textarea[name="instructions[]"]');
      const marks = document.querySelectorAll('input[name="marks[]"]');

      for (let i = 0; i < questionNumbers.length; i++) {
          if (!questionNumbers[i].value.trim() ||
              !questions[i].value.trim() ||
              !instructions[i].value.trim() ||
              !marks[i].value.trim()) {
              return true;
          }
      }
      return false;
  }

  // Modify the event listeners for form submission
  document.getElementById('questionForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission

      if (isAnyFieldEmpty()) {
          alert('Please fill in all fields.');
          return; // Stop the submission if any field is empty
      }

    // Create a FormData object, passing in the form
    var formData = new FormData(this);

    // Send the form data to the server with fetch
    fetch('/submit-form', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();  // Convert the response to a blob
    })
    .then(blob => {
        // Create a URL for the blob
        const pdfUrl = window.URL.createObjectURL(blob);
        // Create a temporary link element
        const tempLink = document.createElement('a');
        tempLink.href = pdfUrl;
        tempLink.download = 'assessment.pdf'; // Set a default file name for the download
        document.body.appendChild(tempLink); // Append to body to ensure it can be "clicked"
        tempLink.click();
        window.URL.revokeObjectURL(pdfUrl);  // Clean up the URL object
        tempLink.remove();  // Remove the temporary link
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error generating the PDF.');
    });
});
  document.getElementById('createStudentAssessment').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default action

  if (isAnyFieldEmpty()) {
      alert('Please fill in all fields.');
      return; // Stop the submission if any field is empty
  }

    var formData = new FormData(document.getElementById('questionForm'));

    // Optionally, add a flag or use a different endpoint to distinguish this request
    formData.append('type', 'student');

    fetch('/submit-form', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
    })
      .then(blob => {
          const docxUrl = window.URL.createObjectURL(blob);
          const tempLink = document.createElement('a');
          tempLink.href = docxUrl;
          tempLink.download = 'student-assessment.docx';  // Corrected file extension
          document.body.appendChild(tempLink);
          tempLink.click();
          window.URL.revokeObjectURL(docxUrl);
          tempLink.remove();
      })
    .catch(error => console.error('Error:', error));
});
