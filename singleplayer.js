var restartButton = document.getElementById("restart");
var new_gameButton = document.getElementById("new_game");
var startButton = document.getElementById("start");
var normalButton = document.getElementById("Normal");
var hardButton = document.getElementById("Hard");
var easyButton = document.getElementById("Easy");
var modePlaceholder = document.getElementById("modePlaceholder");
var mode = "";
var winCases = [[0,1,2] , //Row 1
                [3,4,5] , //Row 2
                [6,7,8] , //Row 3
                [0,3,6] , //col 1
                [1,4,7] , //col 2
                [2,5,8] , //col 3
                [0,4,8] , //diagonal 1  in positive quarter if X Y axies
                [2,4,6]]  //diagonal 2  in negative quarter if X Y axies
//needed for normal mode
var nearWinCases = [[[1,2] , [0,2] , [0,1]] , //Row 1  missed cell to win is the pair place
                    [[4,5] , [3,5] , [3,4]] , //Row 2
                    [[7,8] , [6,8] , [6,7]] , //Row 3
                    [[3,6] , [0,6] , [0,3]] , //col 1
                    [[4,7] , [1,7] , [1,4]] , //col 2
                    [[5,8] , [2,8] , [2,5]] , //col 3
                    [[4,8] , [0,8] , [0,4]] , //diagonal 1  in positive quarter if X Y axies
                    [[4,6] , [2,6] , [2,4]]]  //diagonal 2  in negative quarter if X Y axies
//needed for easy mode
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
    $("#X_wins").text(0);
    $("#O_wins").text(0);
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
    corners = [0,2,6,8]; //needed for hard mode
    edges = [1,3,5,7]; //needed for hard mode
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
    if(!isPlayer1())
    {
        setTimeout(() => {
            nextTurn();
        }, 50);
    }
}

function playerChoice(element)
{
    if($(element).text() !== " ")
        {
            return;
        }
        playerChoiceCell = parseInt($(element).attr("id"));
        displayChoice(player1 , playerChoiceCell , element);
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
        displayChoice(computer , computerChoiceCell , null);
} 

function computerChoiceNormal()
{
    if(!isPlayer1() && freeCells.length === 9)
    {
        computerChoiceCell = freeCells[Math.floor(Math.random() * freeCells.length)];
        displayChoice(computer , computerChoiceCell , null);
        return;
    }
    computerNearWin = false;
    playerNearWin = false;
    computerNearWin = canWin(computer);
    if (!computerNearWin)
    {
        playerNearWin = canWin(player1);
    }
    if (!computerNearWin && !playerNearWin)
    {
        computerChoiceCell = freeCells[Math.floor(Math.random() * freeCells.length)];
    }
    displayChoice(computer , computerChoiceCell , null);
}

function computerChoiceHard()
{
    if(freeCells.length === 9)
    {
        computerChoiceCell = 4;
        displayChoice(computer , computerChoiceCell , null);
        return;
    }
    computerNearWin = false;
    playerNearWin = false;
    computerNearWin = canWin(computer);
    if (!computerNearWin)
    {
        playerNearWin = canWin(player1);
    }
    if (!computerNearWin && !playerNearWin)
    {
        if(freeCells.includes(4))
        {
            computerChoiceCell = 4;
        }
        else if(corners.length !== 0)
        {
            do{
                computerChoiceCell = corners[Math.floor(Math.random() * corners.length)];
            }while(!freeCells.includes(computerChoiceCell));
        }
        else if(edges.length !== 0)
        {
            do{
                computerChoiceCell = edges[Math.floor(Math.random() * edges.length)];
            }while(!freeCells.includes(computerChoiceCell)); 
        }
        else
        {
            computerChoiceCell = freeCells[Math.floor(Math.random() * freeCells.length)];
        }    
    }
    displayChoice(computer , computerChoiceCell , null);
}

function displayChoice(player , choiceCell , element)
{
    player.push(choiceCell);
    freeCells.splice(freeCells.indexOf(choiceCell), 1);
    if(corners.includes(choiceCell))
    {
        corners.splice(corners.indexOf(choiceCell), 1);
    }
    else if(edges.includes(choiceCell))
    {
        edges.splice(edges.indexOf(choiceCell) , 1);
    }
    $("#current_player").text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
    if(element === null)
    {
    $("#" + choiceCell).text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
    }
    else
    {
        $(element).text(current_player_char).css("color" , current_player_char === "X" ? "red" : "blue");
    }
    current_player = (current_player % 2) + 1;
    number_of_playes += 1;
    current_player_char = chars[current_player - 1]; 
}

function canWin(playerList)
{
    for (var i = 0; i < nearWinCases.length; i++)
    {
        for (var j = 0; j < nearWinCases[i].length; j++)
        {
            let missingCell = winCases[i][j];
            let pair = nearWinCases[i][j];
            if (playerList.includes(pair[0]) && playerList.includes(pair[1]))
            {
                let playCell = document.getElementById(missingCell);
                if (playCell.textContent === " ")
                {
                    computerChoiceCell = missingCell;
                    return true;
                }
            }
        }
    }
    return false;
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

function DisplayWinner(Winner , char)
{
    wincase.forEach(element => {
    $("#" + element).addClass("wincell");});
    if(!isPlayer1())
    {
        $("#winnerplaceholder").html("<span style='color: red;'>Player</span> Wins!");
        Winner = ++player1WINS;
    }
    else
    {
        $("#winnerplaceholder").html("<span style='color: blue;'>Computer</span> Wins!");
        Winner = ++computerWINS;
    }
    $("#" + char + "_wins").text(Winner);
}

function nextTurn(element)
{
    if(!win)
    {
        if(isPlayer1())
        {
            playerChoice(element);
            checkWinHelper(player1);
        }
        else
        {
            if(mode === "easy")
            {
                computerChoiceEasy();
            }
            else if(mode === "normal")
            {
                computerChoiceNormal()
            }
            else if(mode === "hard")
            {
                computerChoiceHard();
            }
            checkWinHelper(computer);
        }
        if(win)
        {
            if(!isPlayer1())
            {
                DisplayWinner(player1WINS , chars[current_player - 2]);
            }
            else
            {
                DisplayWinner(computerWINS , chars[current_player]);
            }
        }
    }
}

function isPlayer1()
{
    if(current_player === 1)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function checkWinHelper(playerList)
{
    if(number_of_playes >= 5)
    {
        win = checkWin(playerList);
    }
}

$(".cell").click(function() {
    if(started)
    {
        nextTurn(this);
        if(number_of_playes === 9)
        {}
        else
        {
            setTimeout(() => {
                nextTurn();
            }, 500);
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

easyButton.addEventListener("click" , function(){
    mode = "easy";
    modePlaceholder.textContent = "Current Mode : " + mode;
    startOver();
})

normalButton.addEventListener("click" , function(){
    mode = "normal";
    modePlaceholder.textContent = "Current Mode : " + mode;
    startOver();
})

hardButton.addEventListener("click" , function(){
    mode = "hard";
    modePlaceholder.textContent = "Current Mode : " + mode;
    startOver();
})