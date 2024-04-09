document
  .getElementById("quiz-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const quizTitle = document.getElementById("quiz-title").value;
    const teacherId = "teacher123"; // You can replace this with actual teacher ID
    const quizData = {
      title: quizTitle,
      teacherId: teacherId,
      questions: [],
    };
    const questions = document.querySelectorAll(".question");
    questions.forEach((question, index) => {
      const questionText = question.querySelector(
        `#question${index + 1}`
      ).value;
      const options = [];
      for (let i = 1; i <= 4; i++) {
        const option = question.querySelector(`#option${index + 1}_${i}`).value;
        options.push(option);
      }
      const correctAnswer = question.querySelector(
        `#correct-answer${index + 1}`
      ).value;
      quizData.questions.push({
        question: questionText,
        options: options,
        correctAnswer: correctAnswer,
      });
    });
    fetch("http://localhost:3000/teacher/quizzes", {
      // Changed endpoint to /teacher/quizzes
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
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
        document.getElementById("quiz-form").reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  });
