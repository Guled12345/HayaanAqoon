// Student Page JavaScript
fetch("http://localhost:3000/student/quizzes")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Failed to fetch quizzes");
    }
  })
  .then((quizzes) => {
    const quizList = document.getElementById("quiz-list");
    quizzes.forEach((quiz, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Quiz ${index + 1}: ${quiz.title}`;
      const questionsList = document.createElement("ul");
      quiz.questions.forEach((question, qIndex) => {
        const questionItem = document.createElement("li");
        questionItem.textContent = `Q${qIndex + 1}: ${question.question}`;
        questionsList.appendChild(questionItem);
      });
      listItem.appendChild(questionsList);
      quizList.appendChild(listItem);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
    alert("Failed to fetch quizzes. Please try again later.");
  });
