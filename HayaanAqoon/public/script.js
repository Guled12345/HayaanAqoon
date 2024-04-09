// Fetch quizzes when the page loads
window.onload = function () {
  fetchQuizzes();
};

async function fetchQuizzes() {
  try {
    const response = await fetch("http://localhost:3000/student/quizzes");
    if (!response.ok) {
      throw new Error(
        `Server responded with status: ${response.status} - ${response.statusText}`
      );
    }
    const quizzes = await response.json();
    displayQuizzes(quizzes);
  } catch (error) {
    console.error("Error:", error);
    alert(`Failed to fetch quizzes: ${error.message}`);
  }
}

function displayQuizzes(quizzes) {
  const quizList = document.getElementById("quiz-list");
  quizList.innerHTML = ""; // Clear previous list

  quizzes.forEach((quiz, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Quiz ${index + 1}: ${quiz.title}`;
    quizList.appendChild(listItem);
  });
}

// Function to handle adding new question fields
let questionCounter = 1;
document
  .getElementById("add-question-btn")
  .addEventListener("click", function () {
    questionCounter++;
    const questionsContainer = document.getElementById("questions-container");
    const newQuestion = document.createElement("div");
    newQuestion.classList.add("question");
    newQuestion.innerHTML = `
    <label for="question${questionCounter}">Question ${questionCounter}:</label>
    <input type="text" id="question${questionCounter}" name="question${questionCounter}" required>
    <input type="text" id="option${questionCounter}_1" name="option${questionCounter}_1" placeholder="Option 1" required>
    <input type="text" id="option${questionCounter}_2" name="option${questionCounter}_2" placeholder="Option 2" required>
    <input type="text" id="option${questionCounter}_3" name="option${questionCounter}_3" placeholder="Option 3" required>
    <input type="text" id="option${questionCounter}_4" name="option${questionCounter}_4" placeholder="Option 4" required>
    <select id="correct-answer${questionCounter}" name="correct-answer${questionCounter}" required>
      <option value="" disabled selected>Select correct answer</option>
      <option value="option${questionCounter}_1">Option 1</option>
      <option value="option${questionCounter}_2">Option 2</option>
      <option value="option${questionCounter}_3">Option 3</option>
      <option value="option${questionCounter}_4">Option 4</option>
    </select>
  `;
    questionsContainer.appendChild(newQuestion);
  });

// Function to handle form submission for creating quiz
document
  .getElementById("quiz-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Fetch values from the form
    const quizTitle = document.getElementById("quiz-title").value;
    const teacherId = document.getElementById("teacher-id").value; // Fetch teacher ID

    if (quizTitle.trim() !== "" && teacherId.trim() !== "") {
      // Check both quiz title and teacher ID
      const quizData = {};
      const questions = document.querySelectorAll(".question");

      questions.forEach((question, index) => {
        const questionText = question.querySelector(
          `#question${index + 1}`
        ).value;
        const options = [];
        for (let i = 1; i <= 4; i++) {
          const option = question.querySelector(
            `#option${index + 1}_${i}`
          ).value;
          options.push(option);
        }
        const correctAnswer = question.querySelector(
          `#correct-answer${index + 1}`
        ).value;
        quizData[`question${index + 1}`] = {
          question: questionText,
          options: options,
          correctAnswer: correctAnswer,
        };
      });

      // Send quiz data to the backend server
      fetch("http://localhost:3000/teacher/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: quizTitle,
          teacherId: teacherId,
          questions: Object.values(quizData),
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to create quiz");
          }
        })
        .then((data) => {
          alert("Quiz created successfully.");
          // Clear form fields
          document.getElementById("quiz-form").reset();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again later.");
        });
    } else {
      alert("Please enter both a quiz title and a teacher ID.");
    }
  });
