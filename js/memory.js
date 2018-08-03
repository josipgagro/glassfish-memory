	//variables

	//type of game (based on radio buttons)
	var typeOfGame;
	//countdown interval
	var countDown;
	//seconds left
	var timerValue;
	//score for flipped cards
	var scoreIncrementer;
	//sum of scoreIncrementer and timerValue
	var score;
	// array of flipped cards
	var flippedCards = [];
	//variable for local storage
	var localStorage = window.localStorage;
	//values stored in local storage
	var localStorageArray = localStorage.getItem("score");
	//array of values stored in local storage
	var highScores = [];
	//variable for timer
	var timer = document.getElementById('timer');
	// start button - click on it starts the game
	var startButton = document.getElementById('start');
	// radio button (2 of kind game)
	var ofKindButton = document.getElementById('2OfKind');
	// modal for highscore/end game
	var endGameWindow = document.getElementById('modal');
	// X button for closing endGameWindow
	var closeBtnGameOver = document.getElementById('X-btn');
	// highscore button - click on it shows highscores
	var highscoreButton = document.getElementById('top5');
	// rank elementes - usage for printing out ranks
	var ranks = document.getElementsByClassName('rank');
	// button on endGameWindow for restarting the game
	var playAgainButton = document.getElementById('play-again');
	// array of card elements
	var card = document.getElementsByClassName('flipper');
	// array of card images
	var cardImages = [];
	//array of flipcontainers - usage - for cursor changing
	var flipContainer = document.getElementsByClassName("flip-container");


	//functions
	//some of functions are made for better readability of code, they don't have some superawesome functionality

	//function for dealing when start game is pressed
	function dealDeck() {
	    score = 0;
	    scoreIncrementer = 0;
	    timerValue = 119;
	    setModuleDisplay("hidden");

	    //sets card images based on what kind of game is checked
	    if (ofKindButton.checked) {
	        typeOfGame = 1;
	        cardImages = createDeckBasedOnTypeOfGame(2);
	    } else {
	        typeOfGame = 2;
	        cardImages = createDeckBasedOnTypeOfGame(3);
	    }

	    changeCursor(flipContainer, "pointer");
	    emptyFlippedCardsArray();
	    shuffleDeck(cardImages);
	    setBackImageToCard();
	}

	//sets endGameWindow display style based on passed argument (css value for display property)
	function setModuleDisplay(display) {
	    if (display === 'block') {
	        endGameWindow.classList.remove("display-hidden");
	        endGameWindow.classList.add("display-block");
	        disableOrEnableCards(card, "none");
	        changeCursor(flipContainer, "not-allowed");
	    } else {
	        endGameWindow.classList.remove("display-block");
	        endGameWindow.classList.add("display-hidden");
	        disableOrEnableCards(card, "auto");
	        changeCursor(flipContainer, "pointer");
	    }


	}

	//function for disabling or enabling cards after endGameWindow is displayed
	function disableOrEnableCards(array, style) {
	    for (var i = 0; i < array.length; i++) {
	        switch (style) {
	            case "none":
	                array[i].classList.remove("enable-card");
	                array[i].classList.add("disable-card");
	                break;
	            case "auto":
	                array[i].classList.remove("disable-card");
	                array[i].classList.add("enable-card");
	                break;
	        }
	    }
	}


	//function for adding images to array. Divider is for creating 2 or 3 same images in deck
	function createDeckBasedOnTypeOfGame(divider) {
	    var array = [];
	    for (var i = 0; i < divider; i++) {
	        for (var j = 1; j <= card.length / divider; j++) {
	            array.push("url(images/mem_" + j + ".png)");
	        }
	    }
	    return array;
	}


	//changes cursor on arrays (type - css value for css cursor property)
	function changeCursor(array, type) {
	    for (var i = 0; i < array.length; i++) {
	        switch (type) {
	            case "pointer":
	                array[i].classList.remove("cursor-notallowed");
	                array[i].classList.add("cursor-pointer");
	                break;
	            case "not-allowed":
	                array[i].classList.remove("cursor-pointer");
	                array[i].classList.add("cursor-notallowed");
	                break;

	        }
	    }
	}


	//adds item in local storage 
	function addItemToLocalStorage(label, value) {
	    localStorage.setItem(label, value);
	}


	//name says it all
	function emptyFlippedCardsArray() {
	    flippedCards = [];
	}


	//function for shuffling deck called on every start of game
	function shuffleDeck(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}


	//sets image for flipped cards from cardImages array
	function setBackImageToCard() {
	    for (var i = 0; i < card.length; i++) {
	        if (card[i].classList.contains('flipped')) {
	            card[i].classList.toggle('flipped');
	        }
	        card[i].querySelector('.back').style.backgroundImage = cardImages[i];
	        card[i].querySelector('.back').classList.remove("animate");
	        card[i].querySelector('.back').classList.add("deanimate");
	        card[i].addEventListener('click', flipCard);
	    }
	}

	//function for flipping cards
	function flipCard() {
	    if (checkIsFlipped(this)) {
	        if (typeOfGame === 1) {
	            if (flippedCards.length < 2) {
	                toggleCard(this);
	                addCardToFlippedCards(this);
	                flippedCards.length === 2 && checkMatch();
	            }
	        } else {
	            if (flippedCards.length < 3) {
	                toggleCard(this);
	                addCardToFlippedCards(this);
	                flippedCards.length === 3 && checkMatch();
	            }
	        }
	    }
	}

	//checks if cards contains flipped class
	function checkIsFlipped(card) {
	    return !card.classList.contains('flipped');
	}

	//toggles card to flipped
	function toggleCard(card) {
	    card.classList.toggle('flipped');
	}

	//adds card to flippedCards array
	function addCardToFlippedCards(card) {
	    flippedCards.push(card);
	}


	//functions for checking if cards are the same. If so score increases, if not cards flip back
	function checkMatch() {
	    if (cardsAreTheSame()) {
	        changeOpacityOfCards();
	        switch (typeOfGame) {
	            case 1:
	                scoreIncrementer += 1;
	                break;
	            case 2:
	                scoreIncrementer += 5;
	                break;
	        }
	        emptyFlippedCardsArray();
	    } else {
	        setTimeout(flipBack, 900);
	    }
	}

	//checking if cards are the same
	function cardsAreTheSame() {
	    for (var i = 1; i < flippedCards.length; i++) {
	        if (flippedCards[i].querySelector('.back').style.backgroundImage != flippedCards[0].querySelector('.back').style.backgroundImage)
	            return false;
	    }
	    return true;
	}


	//changing opacity of cards if cards are the same 
	function changeOpacityOfCards() {
	    for (var i = 0; i < flippedCards.length; i++) {
	    	if(flippedCards[i].querySelector('.back').classList.contains("deanimate"))
	    		flippedCards[i].querySelector('.back').classList.remove("deanimate");
	        flippedCards[i].querySelector('.back').classList.add("animate");
	    }
	}

	//flips back cards if cards are not the same and empties array of flipped cards
	function flipBack() {
	    toggleFlippedCards();
	    emptyFlippedCardsArray();
	}

	//toggles flipped on flipped cards
	function toggleFlippedCards() {
	    for (var i = 0; i < flippedCards.length; i++) {
	        flippedCards[i].classList.toggle('flipped');
	    }
	}


	//function called if timer is up or if all cards are correctly flipped
	function finalize() {
	    setModuleDisplay('block');
	    score = scoreIncrementer + timerValue;
	    highScores.push(score);
	    addItemToLocalStorage("score", JSON.stringify(highScores));
	    cleanScores();

	    switch (typeOfGame) {
	        case 1:
	            if (scoreIncrementer === 12) {
	                setMessage("Congratulations!", "Your score is: ", score, "Play again");
	            } else {
	                setMessage("Awww :((", "Your time is up!", "", "Play again");
	            }
	            break;
	        case 2:
	            if (scoreIncrementer === 40) {
	                setMessage("Congratulations!", "Your score is: ", score, "Play again");
	            } else {
	                setMessage("Awww :((", "Your time is up!", "", "Play again");
	            }
	            break;
	    }
	}


	//erase content of ranks
	function cleanScores() {
	    for (var i = 0; i < 5; i++) {
	        ranks[i].innerText = "";
	    }
	}


	//function for setting message in endGameWindow
	function setMessage(title, notf, score, button_tittle) {
	    endGameWindow.querySelector('h1').innerText = title;
	    endGameWindow.querySelector('#note').innerText = notf;
	    endGameWindow.querySelector('#score').innerText = score;
	    endGameWindow.querySelector('#play-again').innerText = button_tittle;
	}


	//event listener for start game button which deals new deck and starts the timer
	startButton.addEventListener("click", function() {
	    clearInterval(countDown);
	    dealDeck();
	    startTimer();
	});


	//starts the timer
	function startTimer() {
	    timer.innerText = 'Time: 2:00';
	    countDown = setInterval(decrementTime, 1000);
	}


	//function for decrementing timer 
	function decrementTime() {
	    switch (true) {
	        //end of the game
	        case (timerValue === 0):
	            timer.innerText = 'Time: 0:0' + timerValue;
	            clearInterval(countDown);
	            finalize();
	            break;
	        case (timerValue < 10):
	            timer.innerText = 'Time: 0:0' + timerValue;
	            break;
	        case (timerValue < 59):
	            timer.innerText = 'Time: 0:' + timerValue;
	            break;
	        case (timerValue == 59):
	            timer.innerText = 'Time: 0:' + timerValue;
	            break;
	        case (timerValue > 59 && timerValue < 70):
	            timer.innerText = 'Time: 1:0' + (timerValue - 60);
	            break;
	        case (timerValue > 59):
	            timer.innerText = 'Time: 1:' + (timerValue - 60);
	            break;
	    }
	    switch (typeOfGame) {
	        case 1:
	            if (scoreIncrementer === 12) {
	                clearInterval(countDown);
	                finalize();
	            }
	            break;
	        case 2:
	            if (scoreIncrementer === 40) {
	                clearInterval(countDown);
	                finalize();
	            }
	            break;
	    }
	    //decrement timer value
	    timerValue--;
	}


	window.addEventListener("load", function() {
	    getHighscore();
	});

	//values from local storage converted to highScores array
	function getHighscore() {
	    if (localStorageArray)
	        highScores = JSON.parse(localStorageArray);
	}


	//event listener on highscore button - shows highscores
	highscoreButton.addEventListener("click", function() {
	    sortHighscore();
	    showHighscore();
	});


	//function for sorting highscores
	function sortHighscore() {
	    highScores.sort(function(a, b) { return b - a });
	}


	//shows endGameWindow with highscores
	function showHighscore() {
	    setModuleDisplay('block');
	    setMessage("", "", "", "");
	    writeOutScores();
	}


	//prints out ranks in endGameWindow
	function writeOutScores() {
	    endGameWindow.querySelector('h1').innerText = 'Top scores: ';
	    for (var i = 0; i < 5; i++) {
	        if (highScores[i]) {
	            ranks[i].innerText = i + 1 + ". " + highScores[i];
	        } else {
	            ranks[i].innerText = i + 1 + ". 0";
	        }
	    }
	}

	//event listener on X button in endGameWindow - closes endGameWindow
	closeBtnGameOver.addEventListener("click", function() {
	    setModuleDisplay('none');
	});

	//event listener on play again button (in endGameWindow) for restarting the game
	playAgainButton.addEventListener("click", function() {
	    setModuleDisplay('none');
	    clearInterval(countDown);
	    dealDeck();
	    startTimer();
	});