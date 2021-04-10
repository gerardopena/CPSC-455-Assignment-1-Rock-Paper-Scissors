"using strict"

const { response } = require("express");

function Game() {
    let currPlayer = {};
    Object.defineProperty(currPlayer, "playerChoice",{writable: true, configurable: true, enumerable: true, value: "rock"});    
    Object.defineProperty(currPlayer, "gameResult",{writable: true, configurable: true, enumerable: true, value: "Tie"}); 
    Object.defineProperty(currPlayer, "wins",{writable: true, configurable: true, enumerable: true, value: 0});    
    Object.defineProperty(currPlayer, "totalGames",{writable: true, configurable: true, enumerable: true, value: 0});
    Object.seal(currPlayer);

    let serverPlayer = {};
    Object.defineProperty(serverPlayer, "serverChoice",{writable: true, configurable: true, enumerable: true, value: "rock"});    
    Object.defineProperty(serverPlayer, "wins",{writable: true, configurable: true, enumerable: true, value: 0});    
    Object.seal(serverPlayer);
}

Game.prototype.serverChoice = function() {

    //let x = Math.floor((Math.random() * 3) + 1);
    let x = Infinity;
    if (x === 1) {
        currPlayer.choice = "rock"
    }
    else if (x === 2) {
        currPlayer.choice = "paper"
    }
    else if (x === 3) {
        currPlayer.choice = "scissors"
    }
    else if (x === infinity || isNaN(x)) {
        currPlayer.choice = "error"
    }
}

Game.prototype.gameRules = function() {
    if(currPlayer.playerChoice === "rock" && serverPlayer.serverChoice === "rock" || currPlayer.playerChoice === "paper" && serverPlayer.serverChoice === "paper" || currPlayer.playerChoice === "scissors" && serverPlayer.serverChoice === "scissors") {
        currPlayer.gameResult = "Tie";
        currPlayer.totalGames++;
    }
    else if(currPlayer.playerChoice === "rock" && serverPlayer.serverChoice === "paper" || currPlayer.playerChoice === "paper" && serverPlayer.serverChoice === "scissors" || currPlayer.playerChoice === "scissors" && serverPlayer.serverChoice === "rock") {
        currPlayer.gameResult = "Server Wins";
        serverPlayer.wins++;
        currPlayer.totalGames++;
    }
    else if(currPlayer.playerChoice === "rock" && serverPlayer.serverChoice === "scissors" || currPlayer.playerChoice === "paper" && serverPlayer.serverChoice === "rock" || currPlayer.playerChoice === "scissors" && serverPlayer.serverChoice === "paper") {
        currPlayer.gameResult = "You win!";
        currPlayer.wins++;
        currPlayer.totalGames++;
    }
}

function RPS(portNumber){
    const express = require("express");

    const app = express();

    let myCurrGame = new Game();

    app.use(express.urlencoded({ extended: true}));
    
    app.set("view engine", "ejs")

    app.get("/", function(req, res) {

        res.sendFile(__dirname + "/index.html");

    });

    app.post("/play", function(req,resp) {

        myCurrGame.currPlayer.playerChoice = req.body.playerchoice;
        
        myCurrGame.serverChoice();
        myCurrGame.gameRules();

        console.log(myCurrGame.currPlayer.playerChoice);
        console.log(myCurrGame.currPlayer.gameResult);
        console.log("Player wins:" + myCurrGame.currPlayer.wins);
        console.log("Total games: " + myCurrGame.currPlayer.totalGames);

        resp.render("results",{gameresult: myCurrGame.currPlayer.gameResult, playerchoice: myCurrGame.currPlayer.playerChoice, serverchoice: myCurrGame.serverPlayer.serverChoice, playerwins: myCurrGame.currPlayer.wins, serverwins: myCurrGame.serverPlayer.wins, totalgames: myCurrGame.currPlayer.totalGames})

    });

    if(portNumber === Infinity || isNaN(portNumber) || portNumber !== 3000) {
        console.log("Invalid Port Number")
    }
    else {
        app.listen(portNumber);
    }
}

let myGame = new RPS(3000);