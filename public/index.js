const rightAudio = new Audio("./sound/right.mp3");
rightAudio.volume = 0.8;
const wrongAudio = new Audio("./sound/wrong.mp3");
wrongAudio.volume = 0.8;
const popAudio = new Audio("./sound/pop.mp3");
popAudio.volume = 0.8;
const heartBreakAudio = new Audio("./sound/heart-break.mp3");
heartBreakAudio.volume = 0.5;

let game;

const url = "https://gameadhd.liara.run";
// const url = "http://localhost:3000";

let username = localStorage.getItem("username");

const svgCicle = document.createElement("img");
svgCicle.src = "./svg/circle.svg";
svgCicle.style.width = "15px";
svgCicle.style.heihgt = "15px";
const timerElemnt = document.getElementById("timer");

const body = document.getElementsByTagName("body")[0];
const svgTryangle = document.createElement("img");
svgTryangle.src = "./svg/tryangle.svg";
svgTryangle.style.width = "15px";
svgTryangle.style.heihgt = "15px";

const svgSquier = document.createElement("img");
svgSquier.src = "./svg/squier.svg";
svgSquier.style.width = "15px";
svgSquier.style.heihgt = "15px";

const ctrl = document.getElementById("box-ctrl");
const question = document.getElementById("qu");
const answer = document.getElementById("box-answer");
const levelHeader = document.getElementById("level");
const deleteE = document.getElementById("delete");

const tryangle = document.createElement("div");
tryangle.className = "item";
tryangle.appendChild(svgTryangle);

const circle = document.createElement("div");
circle.className = "item";
circle.appendChild(svgCicle);

const square = document.createElement("div");
square.className = "item";
square.appendChild(svgSquier);

const hears = document.getElementById("hears");

const hearimg = document.createElement("img");
hearimg.src = "./svg/heart.svg";
hearimg.style.width = "30px";
hearimg.style.heihgt = "30px";

const breakHearImg = document.createElement("img");
breakHearImg.src = "./svg/hearbreak.svg";
breakHearImg.style.width = "30px";
breakHearImg.style.heihgt = "30px";

const left = document.getElementById("left");
left.appendChild(tryangle.cloneNode(true));
left.appendChild(square.cloneNode(true));
left.appendChild(circle.cloneNode(true));
const right = document.getElementById("right");
right.appendChild(square.cloneNode(true));
right.appendChild(circle.cloneNode(true));
right.appendChild(tryangle.cloneNode(true));

const keyOne = tryangle.cloneNode(true);
keyOne.id = "1";
keyOne.className = "item cursorC";

const keyTwo = square.cloneNode(true);
keyTwo.id = "2";
keyTwo.className = "item cursorC";

const keyTree = circle.cloneNode(true);
keyTree.id = "3";
keyTree.className = "item cursorC";

const scoreNode = document.getElementById("score");
const keys = [keyOne, keyTwo, keyTree];
const scores = [];

const sendMessage = function (message, color) {
  const meesageLosingS = document.createElement("div");
  meesageLosingS.className = "message";
  meesageLosingS.style.color = color || "rgb(214, 82, 82)";
  meesageLosingS.innerHTML = message;
  body.appendChild(meesageLosingS);
  setTimeout(() => {
    meesageLosingS.remove();
  }, 3000);
};

class Game {
  constructor(onEnd) {
    console.log("game start");
    this.timer = 10;
    this.onEnd = onEnd;
    this.score = 100;
    this.level = 1;
    this.interval;
    this.hearts = [true, true, true];
    this.loseCount = 0;
    levelHeader.innerHTML = `level ${this.level}`;
    this.questionNArr = this.randomArrNumberGenrator(this.level + 1);
    this.answer = [];
    this.winTime = 0;
    this.dibleCttrl = false;
    this.conrtl();
    this.keyRandom();
    this.updateHearts();
    this.scoreUpdate();
    this.teach = { loseScore: true };
  }
  restartGmae() {
    console.log("game restarted");
    this.score = 100;
    this.level = 1;
    this.interval;
    this.hearts = [true, true, true];
    this.loseCount = 0;
    levelHeader.innerHTML = `level ${this.level}`;
    this.questionNArr = this.randomArrNumberGenrator(this.level + 1);
    this.answer = [];
    this.winTime = 0;
    this.dibleCttrl = false;
    this.keyRandom();
    this.updateHearts();
    this.scoreUpdate();
    this.startGame();
  }

  scoreUpdate(number) {
    scoreNode.innerHTML = `${this.score}`;
    if (!number) return;
    this.score += number;
    scoreNode.innerHTML = `${this.score}`;
    const movingNumber = document.createElement("div");
    movingNumber.className = "movingN";
    movingNumber.innerHTML = number;
    movingNumber.style.color = number > 0 ? "green" : "red";
    movingNumber.style.scale = `${1 + Math.abs(number) * 0.01}`;
    movingNumber.style.left = `${
      Math.random() * parseInt(scoreNode.parentElement.clientWidth)
    }px`;
    scoreNode.parentElement.appendChild(movingNumber);
    scoreNode.style.scale = "0.9";
    setTimeout(() => {
      scoreNode.style.scale = "1";
    }, 100);

    setTimeout(() => {
      movingNumber.remove();
    }, 2000);

    // if (this.score < 0) return this.lose();
  }

  randomArrNumberGenrator = (length) => {
    const randomArrNumber = [];
    let allowedNumbers = [1, 2, 3];

    for (let i = 0; i < length; i++) {
      const newValue = parseInt(Math.random() * allowedNumbers.length);

      randomArrNumber.push(allowedNumbers[newValue]);
      allowedNumbers = allowedNumbers.filter(
        (item) => item !== allowedNumbers[newValue]
      );
      if (allowedNumbers.length === 0) allowedNumbers = [1, 2, 3];
    }
    return randomArrNumber;
  };

  startGame() {
    this.showQuestion();
    this.showAnswer();
    this.interval = setInterval(() => {
      timerElemnt.innerHTML = this.timer;
      if (this.timer === 1) {
        setTimeout(() => {
          this.loseCount++;
          heartBreakAudio.currentTime = 0;
          heartBreakAudio.play();
          if (this.loseCount === 3) {
            this.lose();
            return;
          }
          this.hearts.forEach((e, i) => {
            if (i <= this.loseCount - 1) this.hearts[i] = false;
          });
          this.updateHearts();
        }, 1000);
      }
      if (this.timer === 0) {
        if (this.teach.loseScore) {
          sendMessage("you are losing score");
          this.teach.loseScore = false;
        }
        this.scoreUpdate(-1);
        setTimeout(() => {
          this.scoreUpdate(-1);
        }, 200);
      } else {
        this.timer -= 1;
      }
    }, 1000);
  }

  checkAnwser() {
    const currectAnswer = this.questionNArr.map((e) => {
      if (e === 1) return 2;
      if (e === 2) return 3;
      if (e === 3) return 1;
    });

    const isPlayWin = currectAnswer.every(
      (value, index) => value === this.answer[index]
    );

    if (isPlayWin) this.correctAnswer();
    else this.wrongAnswer(currectAnswer);
  }
  updateHearts() {
    hears.children[0].innerHTML = "";
    hears.children[1].innerHTML = "";
    hears.children[2].innerHTML = "";
    console.log("lose count :", this.loseCount);
    hears.children[0].appendChild(
      this.hearts[0] ? hearimg.cloneNode(true) : breakHearImg.cloneNode(true)
    );
    hears.children[1].appendChild(
      this.hearts[1] ? hearimg.cloneNode(true) : breakHearImg.cloneNode(true)
    );
    hears.children[2].appendChild(
      this.hearts[2] ? hearimg.cloneNode(true) : breakHearImg.cloneNode(true)
    );
  }
  lose() {
    console.log("player lose,interwall cleared");
    clearInterval(this.interval);
    this.onEnd(this.score, this);
  }

  correctAnswer() {
    this.scoreUpdate(25 * this.level);
    this.winTime++;
    rightAudio.currentTime = 0;
    rightAudio.play();

    document.getElementsByTagName("body")[0].style.background =
      "rgb(71, 102, 12)";
    setTimeout(() => {
      document.getElementsByTagName("body")[0].style.background =
        "rgb(48, 48, 48)";
    }, 200);
    setTimeout(() => {
      this.restart();
    }, 1000);
  }
  wrongAnswer(currectAnswer) {
    this.scoreUpdate(-25 * this.level);
    this.loseCount++;
    if (this.loseCount === 3) {
      this.lose();
      return;
    }
    this.hearts.forEach((e, i) => {
      if (i <= this.loseCount - 1) this.hearts[i] = false;
    });
    this.updateHearts();
    wrongAudio.currentTime = 0;
    wrongAudio.play();
    this.answer.forEach((e, i) => {
      // console.log("cheling to make it red", currectAnswer, this.answer);
      if (e !== currectAnswer[i]) answer.childNodes[i].style.background = "red";
    });

    setTimeout(() => {
      this.restart();
    }, 1500);
  }

  showQuestion() {
    console.log("question number : ", this.questionNArr);

    question.innerHTML = "";
    this.questionNArr.forEach((e) => {
      if (e === 1) question.appendChild(tryangle.cloneNode(true));
      if (e === 2) question.appendChild(square.cloneNode(true));
      if (e === 3) question.appendChild(circle.cloneNode(true));
    });
  }
  showAnswer() {
    console.log("asnwer number : ", this.answer);

    answer.innerHTML = "";

    this.answer.forEach((e, i) => {
      let addedKey;
      if (e === 1) addedKey = tryangle.cloneNode(true);
      if (e === 2) addedKey = square.cloneNode(true);
      if (e === 3) addedKey = circle.cloneNode(true);
      if (i === this.answer.length - 1) addedKey.className += " popAnmin";
      answer.appendChild(addedKey);
    });
    for (let i = 0; i < this.questionNArr.length - this.answer.length; i++) {
      const empty = square.cloneNode(true);
      empty.lastChild.style.opacity = "0";
      answer.appendChild(empty);
    }
    this.showQuestion();
  }

  conrtl() {
    ctrl.addEventListener("click", (e) => {
      if (this.dibleCttrl) return;
      if (!e.target.id === "box-ctrl") return;
      if (e.target.id === "delete") {
        console.log("delete");
        e.preventDefault();
        this.answer.pop();
        this.showAnswer();
        return;
      }
      const keyid = e.target.id || e.target.closest("[id]").id;
      console.log("add new answer", parseInt(keyid));
      popAudio.currentTime = 0.2;
      popAudio.play();
      this.answer.push(parseInt(keyid));
      this.showAnswer();
      if (this.answer.length === this.questionNArr.length) {
        this.dibleCttrl = true;
        this.checkAnwser();
        setTimeout(() => {}, 500);
      }
    });
  }

  keyRandom = () => {
    keys.forEach((key) => {
      if (key.parentNode === ctrl) ctrl.removeChild(key);
    });
    this.randomArrNumberGenrator(3).forEach((e) => {
      ctrl.appendChild(keys[e - 1]);
    });
  };

  restart() {
    this.keyRandom();
    console.log("restart game");
    if (this.winTime !== 0 && this.winTime % 2 === 0) {
      this.level++;
      levelHeader.innerHTML = `level ${this.level}`;
    }
    this.timer = parseInt(5 + Math.sqrt(this.level) * 5);
    this.questionNArr = this.randomArrNumberGenrator(this.level + 1);
    answer.innerHTML = "";
    this.answer = [];
    this.showAnswer();
    this.showQuestion();
    this.dibleCttrl = false;
  }
}

const callbackWhenGameEnd = async (score, thisGame) => {
  console.log("and the end...");
  const losePage = document.createElement("dev");
  losePage.className = "winlose";
  const textE = document.createElement("dev");
  textE.className = "startText endgame";

  textE.innerHTML = `you lose your score is: <span>${score}</span>`;
  losePage.appendChild(textE);

  const restartB = document.createElement("button");
  restartB.className = "item cursorC";
  restartB.innerHTML = "Restart Game";
  restartB.addEventListener("click", (e) => {
    e.preventDefault();
    //gmae start agane
    losePage.remove();
    thisGame.restartGmae();
  });

  // const bestScore = [
  //   { username: "mohsen", score: 200 },
  //   { username: "elahe", score: 520 },
  //   { username: "mamad", score: 400 },
  // ];
  const res = await fetch(url + "/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      score: score,
    }),
  });

  const bestScore = await res.json();
  console.log("we fetch best score : ", bestScore);
  const ScoreBord = document.createElement("div");
  ScoreBord.className = "score-bord";
  const card = document.createElement("div");
  card.className = "card";

  bestScore.forEach((e, i) => {
    const cardClone = card.cloneNode();
    cardClone.innerHTML = `
      <div>${i + 1}-${e.username}</div>
      <span>${e.score}</span>
    `;
    ScoreBord.appendChild(cardClone);
  });
  losePage.appendChild(ScoreBord);
  losePage.appendChild(restartB);

  document.getElementsByTagName("body")[0].appendChild(losePage);
};
game = new Game(callbackWhenGameEnd);

const questionMarkB = document.getElementById("qm");
const info = document.getElementById("info");
const exitB = document.getElementById("exit");

exitB.addEventListener("click", (e) => {
  e.preventDefault();
  info.style.display = "none";
});
questionMarkB.addEventListener("click", (e) => {
  e.preventDefault();
  info.style.display = "flex";
});

const startgamePage = document.createElement("div");
startgamePage.className = "winlose";
const startButton = document.createElement("button");
startButton.className = "item cursorC";
startButton.innerHTML = "Start Game";
const startText = document.createElement("div");
startText.innerHTML = "<h1>ADHD Gmae</h1> <p>wellcom</p>";
startText.className = "startText";

startgamePage.appendChild(startText);

if (!username) {
  const usernameForm = document.createElement("div");
  usernameForm.className = "user-form";
  const lable = document.createElement("label");
  lable.innerHTML = "chose nikename";
  const inputUser = document.createElement("input");
  inputUser.type + "text";
  inputUser.addEventListener("change", (e) => {
    username = e.target.value;
  });
  usernameForm.appendChild(lable);
  usernameForm.appendChild(inputUser);

  startgamePage.appendChild(usernameForm);
}

startgamePage.appendChild(startButton);

document.getElementsByTagName("body")[0].appendChild(startgamePage);

startButton.addEventListener("click", (e) => {
  if (!username) return sendMessage("chose a nikename.", "rgb(194, 174, 0)");
  if (username.length <= 3)
    return sendMessage(
      "nikename must have atlist 3 chareter.",
      "rgb(194, 174, 0)"
    );
  e.preventDefault();
  game.startGame();
  startgamePage.remove();
});
