var restartButton = document.getElementById("restart");
var new_gameButton = document.getElementById("new_game");
var choice;
var winCases = [[0,3,6] , [1,4,7] , [2,5,8] , 
                [0,1,2] , [3,4,5] , [6,7,8] , 
                [0,4,8] , [2,4,6]]

function startOver()
{
    TurnNumber = 1;
    new_game();
    player1WINS = 0;
    player2WINS = 0;
    draws = 0;
    $("#x_wins").text(0);
    $("#o_wins").text(0);
    $("#draws").text(0);

}

function new_game()
{
    player1 = [];
    player2 = [];
    if(TurnNumber % 2 !== 0){
        current_player = 1;
        current_player_char = "X";
        TurnNumber += 1;
    }
    else{
        current_player = 2;
        current_player_char = "O";
        TurnNumber += 1;
    }
    number_of_playes = 0;
    win = false;
    started = true;
    $("#current_player").text(current_player_char);
    $("#current_player").css("color" , current_player_char === "X" ? "red" : "blue");
    $(".cell").text(" ");
    $(".cell").css("background-color" , "white");
    $("#winnerplaceholder").html("Tic Tac Toe");
    wincase = [];
    firstTurn = false;
}

function playerChoice(player ,element)
{
    if($(element).text() !== " "){
            return;
        }
    player.push(parseInt($(element).attr("id")));
        $(element).text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
        current_player = (current_player % 2) + 1;
        number_of_playes += 1;
        if(current_player === 1)
        {
            current_player_char = "X";
        }
        else
        {
            current_player_char = "O";
        }
        $("#current_player").text(current_player_char);
        $("#current_player").css("color" , current_player_char === "X" ? "red" : "blue");
        
}

function checkWin(player)
{
    for(var i=0; i < winCases.length; i++){

        if(player.includes(winCases[i][0]) && player.includes(winCases[i][1]) && player.includes(winCases[i][2]))
        {
            wincase = winCases[i];
            started = false;
            return true;
        }
    }
    if(number_of_playes === 9){
        started = false;
        draws += 1;
        $("#draws").text(draws);
        $("#winnerplaceholder").html("It's a <span style='color: #ffcd71;'>Draw</span>!");
        $(".cell").css("background-color" , "#ffcd71");
    }
    return false;
}   

startOver(); 

$(".cell").click(function() {
    if(started){
        if(current_player === 1){
        playerChoice(player1 , this);
        if(number_of_playes >= 5){
            win = checkWin(player1);
        }
        if(win && current_player === 2){
            wincase.forEach(element => {
            $("#" + element).css("background-color" , "#4CAF50");});
            player1WINS += 1;
            $("#x_wins").text(player1WINS);
            $("#winnerplaceholder").html("Player <span style='color: red;'>X</span> Wins!");
        }   
    }
    else{
        playerChoice(player2 , this);
        if(number_of_playes >= 5){
            win = checkWin(player2);
        }
        if(win && current_player === 1){
            wincase.forEach(element => {
            $("#" + element).css("background-color" , "#4CAF50");});
            player2WINS += 1;
            $("#o_wins").text(player2WINS);
            $("#winnerplaceholder").html("Player <span style='color: blue;'>O</span> Wins!");
        }
        }
    }
});

restartButton.addEventListener("click", function() {
    startOver();
}); 

new_gameButton.addEventListener("click", function() {
    new_game();
});