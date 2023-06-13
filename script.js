let questions = []; 
let studentAnswers = [];

document.getElementById("create-button").addEventListener("click", function() {
    createQuestions('grammar', 'difficulty');
});

document.getElementById("check-button").addEventListener("click", function() {
    checkAnswers();
});

function createQuestions(grammar, difficulty) {
    // Make a fetch request to the Google Cloud Function to create questions
    fetch('https://REGION-PROJECT_ID.cloudfunctions.net/createQuestions', {
        method: 'POST',
        body: JSON.stringify({grammar: grammar, difficulty: difficulty}),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        // Handle the data from the cloud function
        questions = data.questions;
        displayQuestions();
    });
}

function displayQuestions() {
    let container = document.getElementById('question-container');
    questions.forEach((q, i) => {
        let questionDiv = document.createElement('div');
        questionDiv.innerText = q.question;

        let answerInput = document.createElement('input');
        answerInput.id = 'answer-' + i;

        container.appendChild(questionDiv);
        container.appendChild(answerInput);
    });
}

function checkAnswers() {
    questions.forEach((q, i) => {
        let studentAnswer = document.getElementById('answer-' + i).value;
        studentAnswers.push(studentAnswer);

        if (q.answer.toLowerCase() === studentAnswer.toLowerCase()) {
            document.getElementById('answer-' + i).classList.add('correct');
        } else {
            document.getElementById('answer-' + i).classList.add('incorrect');
            // Fetch the explanation from the Google Cloud Function
            fetch('https://REGION-PROJECT_ID.cloudfunctions.net/getExplanation', {
                method: 'POST',
                body: JSON.stringify({question: q, answer: studentAnswer}),
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => response.json())
            .then(data => {
                // Display the explanation from the cloud function
                let explanationDiv = document.createElement('div');
                explanationDiv.innerText = data.explanation;
                document.getElementById('answer-' + i).parentNode.appendChild(explanationDiv);
            });
        }
    });
}
