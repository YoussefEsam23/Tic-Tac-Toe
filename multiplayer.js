var mode = "";
$("#singleplayer").click(function() {
    mode = "singleplayer";
    window.location.href = "singleplayer.html";
});
$("#multiplayer").click(function() {
    mode = "multiplayer";
    window.location.href = "multiplayer.html";
});

var restartButton = document.getElementById("restart");
var new_gameButton = document.getElementById("new_game");
var choice;
var winCases = [[0,3,6] , [1,4,7] , [2,5,8] , 
                [0,1,2] , [3,4,5] , [6,7,8] , 
                [0,4,8] , [2,4,6]]
var chars = ["X" , "O"];

function startOver()
{
    TurnNumber = 1;
    player1WINS = 0;
    player2WINS = 0;
    draws = 0;
    $("#x_wins").text(0);
    $("#o_wins").text(0);
    $("#draws").text(0);
    new_game();
}

function new_game()
{
    player1 = [];
    player2 = [];
    if(TurnNumber % 2 !== 0)
        {
            current_player = 1;
            current_player_char = "X";
            TurnNumber += 1;
        }
    else
        {
            current_player = 2;
            current_player_char = "O";
            TurnNumber += 1;
        }
    number_of_playes = 0;
    win = false;
    started = true;
    $("#current_player").text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
    $(".cell").text(" ").removeClass("no-hover").removeClass("wincell").removeClass("drawcell");
    $("#winnerplaceholder").html("Tic Tac Toe");
    $(".btn").addClass("no-hover").addClass("btnNoactive");
    wincase = [];
    firstTurn = false;
}

function playerChoice(player ,element)
{
    if($(element).text() !== " ")
        {
            return;
        }
    player.push(parseInt($(element).attr("id")));
    $(element).text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
    current_player = (current_player % 2) + 1;
    number_of_playes += 1;
    current_player_char = chars[current_player - 1];
    $("#current_player").text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
}

function checkWin(player)
{
    for(var i=0; i < winCases.length; i++)
        {

            if(player.includes(winCases[i][0]) && player.includes(winCases[i][1]) && player.includes(winCases[i][2]))
            {
                wincase = winCases[i];
                started = false;
                $(".cell").addClass("no-hover");
                $(".btn").removeClass("no-hover").removeClass("btnNoactive");
                return true;
            }
        }
    if(number_of_playes === 9)
        {
            started = false;
            draws += 1;
            $("#draws").text(draws);
            $("#winnerplaceholder").html("It's a <span style='color: #ffcd71;'>Draw</span>!");
            $(".cell").addClass("no-hover").addClass("drawcell");
            $(".btn").removeClass("no-hover").removeClass("btnNoactive");
            return false;
        }
    return false;
}   

startOver(); 

$(".cell").click(function() {
    if(started)
    {
        if(current_player === 1)
            {
                playerChoice(player1 , this);
                if(number_of_playes >= 5)
                    {
                        win = checkWin(player1);
                    }
                if(win && current_player === 2)
                    {
                        wincase.forEach(element => {
                        $("#" + element).addClass("wincell");});
                        player1WINS += 1;
                        $("#x_wins").text(player1WINS);
                        $("#winnerplaceholder").html("Player <span style='color: red;'>X</span> Wins!");
                    }   
            }
        else
            {
                playerChoice(player2 , this);
                if(number_of_playes >= 5)
                    {
                    win = checkWin(player2);
                    }
                if(win && current_player === 1)
                    {
                        wincase.forEach(element => {
                        $("#" + element).addClass("wincell");});
                        player2WINS += 1;
                        $("#o_wins").text(player2WINS);
                        $("#winnerplaceholder").html("Player <span style='color: blue;'>O</span> Wins!");
                    }
            }
    }
});

restartButton.addEventListener("click", function() {
    if(!started)
    {
        startOver();
    }
}); 

new_gameButton.addEventListener("click", function() {
    if(!started)
    {
        new_game();
    }
});