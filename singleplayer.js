var restartButton = document.getElementById("restart");
var new_gameButton = document.getElementById("new_game");
var startButton = document.getElementById("start");
var playWincell = null;
var winCases = [[0,1,2] , //Row 1
                [3,4,5] , //Row 2
                [6,7,8] , //Row 3
                [0,3,6] , //col 1
                [1,4,7] , //col 2
                [2,5,8] , //col 3
                [0,4,8] , //diagonal 1  in positive quarter if X Y axies
                [2,4,6]]  //diagonal 2  in negative quarter if X Y axies]
var nearWinCases = [[[1,2] , [0,2] , [0,1]] , 
                    [[4,5] , [3,5] , [3,4]] ,
                    [[7,8] , [6,8] , [6,7]] , 
                    [[3,6] , [0,6] , [0,3]] , 
                    [[4,7] , [1,7] , [1,4]] , 
                    [[5,8] , [2,8] , [2,5]] , 
                    [[4,8] , [0,8] , [0,4]] , 
                    [[4,6] , [2,6] , [2,4]]]
var computerPossiblePlacment = [[1,3,4] , // cell 0 
                                [0,2,4] , // cell 1
                                [1,4,5] , // cell 2
                                [0,4,6] , // cell 3
                                []      , // cell 4 handeld in another way
                                [2,4,8] , // cell 5
                                [3,4,7] , // cell 6
                                [4,6,8] , // cell 7
                                [4,5,7] , // cell 8
                                ]
var chars = ["X" , "O"];

function startOver()
{
    TurnNumber = 1;
    player1WINS = 0;
    computerWINS = 0;
    draws = 0;
    mode = " ";
    $("#x_wins").text(0);
    $("#o_wins").text(0);
    $("#draws").text(0);
    new_game();
}

function new_game()
{
    player1 = [];
    computer = [];
    playerChoiceCell = 0;
    computerChoiceCell = 0;
    userLastChoice = 0;
    _3possiblemoves = [];
    _3movesNotIncluded = false;
    playerNearWin = false;
    computerNearWin = false;
    freeCells = [0,1,2,3,4,5,6,7,8];
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
    if(current_player === 2)
        {
                computerTurn();
        
        }
}

function playerChoice(player ,element)
{
    if($(element).text() !== " ")
        {
            return;
        }
        playerChoiceCell = parseInt($(element).attr("id"));
        player.push(playerChoiceCell);
        freeCells.splice(freeCells.indexOf(playerChoiceCell), 1);
        $(element).text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
        current_player = (current_player % 2) + 1;
        number_of_playes += 1;
        current_player_char = chars[current_player - 1];
        $("#current_player").text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
}

function playerTurn(element)
{
    if(!win)
        {
            playerChoice(player1 , element);
            if(number_of_playes >= 5)
                {
                win = checkWin(player1);
                }
            if(win && current_player === 2)
                {
                    wincase.forEach(element => {
                    $("#" + element).addClass("wincell");});
                    computerWINS += 1;
                    $("#x_wins").text(computerWINS);
                    $("#winnerplaceholder").html("Computer <span style='color: blue;'>O</span> Wins!");
                }
        }
}

function computerDisplay()
{
    computer.push(computerChoiceCell);
    freeCells.splice(freeCells.indexOf(computerChoiceCell), 1);
    $("#" + computerChoiceCell).text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
    current_player = (current_player % 2) + 1;
    number_of_playes += 1;
    current_player_char = chars[current_player - 1];
    $("#current_player").text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
}
function computerChoiceEasy()
{
    userLastChoice = player1[player1.length-1];
    _3possiblemoves = computerPossiblePlacment[userLastChoice];
    if((current_player === 2 && freeCells.length === 9) ||  userLastChoice === 4)
        {
            computerChoiceCell = freeCells[Math.floor(Math.random() * freeCells.length)];
        }
    else
        {
            do  {
                    computerChoiceCell = computerPossiblePlacment[userLastChoice][Math.floor(Math.random() * 103) - 100]
                    if(!freeCells.includes(_3possiblemoves[0]) && !freeCells.includes(_3possiblemoves[1]) && !freeCells.includes(_3possiblemoves[2]))
                    {
                        _3movesNotIncluded = true;
                        break;
                    }
                }
                while(!freeCells.includes(computerChoiceCell));
            if(_3movesNotIncluded)
                {
                    computerChoiceCell = freeCells[Math.floor(Math.random() * freeCells.length)];
                }
        }
        computerDisplay();
}

function computerChoiceNormal()
{
    if(current_player === 2 && freeCells.length === 9)
    {
        computerChoiceCell = freeCells[Math.floor(Math.random() * freeCells.length)];
        computerDisplay();
        return;
    }
    computerNearWin = false;
    playerNearWin = false;
    for (let i = 0; i < nearWinCases.length; i++)
    {
        for (let j = 0; j < nearWinCases[i].length; j++)
        {
            let missingCell = winCases[i][j];
            let pair = nearWinCases[i][j];
            if (computer.includes(pair[0]) && computer.includes(pair[1]))
            {
                let playCell = document.getElementById(missingCell);
                if (playCell.textContent === " ")
                {
                    computerNearWin = true;
                    computerChoiceCell = missingCell;
                    break;
                }
            }
        }
        if (computerNearWin) break;
    }
    if (!computerNearWin)
    {
        for (let i = 0; i < nearWinCases.length; i++)
        {
            for (let j = 0; j < nearWinCases[i].length; j++)
            {
                let missingCell = winCases[i][j];
                let pair = nearWinCases[i][j];
                if (player1.includes(pair[0]) && player1.includes(pair[1]))
                {
                    let playCell = document.getElementById(missingCell);
                    if (playCell.textContent === " ")
                    {
                        playerNearWin = true;
                        computerChoiceCell = missingCell;
                        break;
                    }
                }
            }
            if (playerNearWin) break;
        }
    }
    if (!computerNearWin && !playerNearWin)
    {
        computerChoiceCell = freeCells[Math.floor(Math.random() * freeCells.length)];
    }

    computerDisplay();
}


function computerTurn()
{
    setTimeout(() => {
                    if(!win)
                    {
                        /* computerChoiceEasy(computer); */
                        computerChoiceNormal(computer);
                        if(number_of_playes >= 5)
                            {
                            win = checkWin(computer);
                            }
                        if(win && current_player === 1)
                            {
                                wincase.forEach(element => {
                                $("#" + element).addClass("wincell");});
                                computerWINS += 1;
                                $("#o_wins").text(computerWINS);
                                $("#winnerplaceholder").html("Computer <span style='color: blue;'>O</span> Wins!");
                            }
                    
                    }}, 500);
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
    if(number_of_playes === 9){
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
            playerTurn(this);
            if(number_of_playes === 9)
                {

                }
            else
                {

                computerTurn();
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