// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      // Create Bullets + Set Questions Count
      createBullets(qCount);
      //Add Question Dada
      addQuestionData(questionsObject[currentIndex], qCount);
      //Start CountDown
      countDown(5, qCount);
      //Click On Submit
      submitButton.onclick = () => {
        //Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        //Increase Index
        currentIndex++;
        //Check The Answer
        checkAnswer(theRightAnswer);
        //Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        //Add Question Dada
        addQuestionData(questionsObject[currentIndex], qCount);
        //Handle Bullets Class
        handleBullets();
        //Start CountDown
        clearInterval(countDownInterval);
        countDown(5, qCount);
        //Show Results
        showResults(qCount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  //Create Spans
  for (let i = 0; i < num; i++) {
    //Create Bullets
    let theBullet = document.createElement("span");
    //Check If It's First Span
    if (i === 0) {
      theBullet.className = "on";
    }
    //Append Bullets To Main Bullet Container
    bulletSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    //Create H2 Question Tittle
    let questionTittle = document.createElement("h2");
    //Create Question Text
    let questionText = document.createTextNode(obj["tittle"]);
    //Append Text To H2
    questionTittle.appendChild(questionText);
    //Append The H2 To the Quiz Area
    quizArea.appendChild(questionTittle);
    //Create The Answers
    for (let i = 1; i <= 4; i++) {
      //Create The Main Answer Div
      let mainDiv = document.createElement("div");
      //Add Class To Main Div
      mainDiv.className = "answer";
      //Create Radio Input
      let radioInput = document.createElement("input");
      //Add Type + Name + Id + Data-Attribute
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      //Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }
      //Create Label
      let theLabel = document.createElement("label");
      //Add For Attribute
      theLabel.htmlFor = `answer_${i}`;
      //Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      //Add The Text To Label
      theLabel.appendChild(theLabelText);
      //Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      //Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpan = Array.from(bulletsSpans);
  arrayOfSpan.forEach((element, index) => {
    if (currentIndex === index) {
      element.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Are Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
