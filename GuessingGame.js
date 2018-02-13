function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
  var l = arr.length, t, t2;
  while (l) {
    t = Math.floor(Math.random() * l);
    l--;
    t2 = arr[l];
    arr[l] = arr[t];
    arr[t] = t2;
  }
  return arr;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
  this.reset = false;
}

Game.prototype.difference = function() {
  return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
  return this.winningNumber > this.playersGuess ? true : false;
}

Game.prototype.playersGuessSubmission = function(n) {
  if (n === 0 || n < 0 || n > 100 || isNaN(n)) {
    $("#title").text("That is an invalid guess.");
  }
  else {
    this.playersGuess = n;
    return this.checkGuess();
  }
}

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    var audio = new Audio('final-fantasy-v-music-victory-fanfare.mp3');
    audio.play();
    $("#title").text(`You Win! The answer was ${this.winningNumber}!`);
    $("#subtitle").text("Click 'Reset Game' to try again!");
    this.reset = true;
  }
  else {
    if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
      $("#title").text("You have already guessed that number");
    }
    else {
      this.pastGuesses.push(this.playersGuess);
      $('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
      if (this.pastGuesses.length === 5) {
        var audio = new Audio('the-price-is-right-losing-horn.mp3');
        audio.play();
        this.reset = true;
        $("#title").text("You Lose.");
        $("#subtitle").text("Click 'Reset Game' to try again!");
      }
      else {
        var diff = this.difference();
        if (!this.isLower()) {
          $("#subtitle").text("Guess Lower!");
        }
        else {
          $("#subtitle").text("Guess Higher!");
        }
        if (diff < 10) {
          $("#title").text("You\'re burning up!");
        }
        else if (diff < 25) {
          $("#title").text("You\'re lukewarm");
        }
        else if (diff < 50) {
          $("#title").text("You\'re a bit chilly");
        }
        else {
          $("#title").text("You\'re ice cold!");
        }
      }
    }
  }
}

function newGame() {
  return new Game();
}

Game.prototype.provideHint = function() {
  var hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
  return shuffle(hintArr);
}

$(document).ready(function() {

  function submission(newGame) {
    if (!newGame.reset) {
      var guess = parseInt($("#numdisplay").val());
      newGame.playersGuessSubmission(guess);
      $("#numdisplay").val("");
    }
  }

  var newGame = new Game();

  $("#submit").on('click', function() {
    submission(newGame);
  });

  $(document).on("keydown", function(event) {
    if (event.keyCode === 13) {
      submission(newGame);
    }
  });

  $("#hint").on('click', function() {
    var hints = newGame.provideHint();
    if (newGame.reset === true) {
      $("#title").text(`The correct answer was ${newGame.winningNumber}!`);
    }
    else {
      $("#title").text(`The answer is either ${hints[0]}, ${hints[1]}, or ${hints[2]}!`);
    }
  });

  $("#resetGame").on('click', function() {
    newGame = new Game();
    $("#title").text("Play the Guessing Game!");
    $("#subtitle").text("Guess a number between 1-100");
    $("#guesses").find("li").text("-");
    $("#numdisplay").val("");
  });
});
