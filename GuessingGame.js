function generateWinningNumber(){
    //return Math.ceil(Math.random()*100)
    return Math.floor(Math.random()*100+1)
}

function shuffle(arr){
    let temp;
    let m = arr.length;
    while(m){
        let i = Math.floor(Math.random()* m--)
        temp = arr[m];
        arr[m] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber)
}

Game.prototype.isLower = function(){
    if(this.playersGuess > this.winningNumber){
        return 'Guess lower.';
    } else {
        return 'Guess higher.';
    }
}

Game.prototype.playersGuessSubmission = function(n){
    if(n<1 || n>100 || isNaN(n)=== true){
        throw "That is an invalid guess."
    } else {
        this.playersGuess = n;
        return this.checkGuess();
    

    }
}

Game.prototype.checkGuess = function(){
    

    if(this.playersGuess === this.winningNumber){
        $('#headers h1').text('YOU WIN!');
        $('#headers h2').text('Click Reset Button to Play Again!');
        $('#hint, #submit').prop("disabled",true);
        $('#headers h4').text("");
    }
    if(this.pastGuesses.includes(this.playersGuess)){
        return 'You have already guessed that number.'
    }
    if(this.pastGuesses.length === 5){
        this.pastGuesses.push(this.playersGuess);
        $('#headers h1').text('YOU DIED!');
        $('#headers h2').text('Click Reset Button to Play Again!');
        $('#headers h4').text("");
        $('#hint, #submit').prop("disabled",true);
    } else {

        this.pastGuesses.push(this.playersGuess);
        let hint = this.isLower()
        if(this.difference() < 10){
            $('#headers h4').text('You\'re burning up! ' + hint);
        }else if(this.difference() < 25){
            $('#headers h4').text('You\'re lukewarm. ' + hint)
        }else if(this.difference() < 50){
            $('#headers h4').text('You\'re a bit chilly. ' + hint)
        }else if(this.difference() <100){
            $('#headers h4').text('You\'re ice cold! ' + hint)
        }
    }
}

function newGame(){
    return new Game()
}

Game.prototype.provideHint = function(){
    return shuffle([this.winningNumber, generateWinningNumber(),generateWinningNumber()])
}

$(document).ready(function(){

    var game = newGame();

    $('#reset').click(function(){
        game = newGame();
        $('#headers h2').text('Guess a number between 1-100!')
        $('#title').text('Play the Guessing Game!');
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false)
        ;
    });
        
    var submit = function(){
        var guess = parseInt($('#player-input').val(),10);
        if(game.pastGuesses.includes(guess)){
            $('#headers h1').text('Guess Again, You\'ve Already Guessed This Number!');
        } else {
            game.checkGuess();
            $('#guesses li:nth-child('+game.pastGuesses.length+')').text(guess)
        }
        game.playersGuessSubmission(guess);
        $('#player-input').val('');
        console.log('guess is:',game.playersGuess,game.pastGuesses);

        game.checkGuess();
        
    }
    $('#submit').click(function(){
        submit();
    })
    $('#player-input').keypress(function(event){
        if(event.which == '13'){
            submit();
        }
    })
    $('#hint').click(function(){
        $('#title').text('Hint: ' + game.provideHint());
    })
})
