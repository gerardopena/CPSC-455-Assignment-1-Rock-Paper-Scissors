"using strict"

const { response } = require("express");

function RPS(portNumber){

    let currPlayer = {};
    Object.defineProperty(currPlayer, "playerChoice",{writable: true, configurable: false, enumerable: false, value: "rock"});    
    Object.defineProperty(currPlayer, "gameResult",{writable: true, configurable: false, enumerable: false, value: "Tie"}); 
    Object.defineProperty(currPlayer, "wins",{writable: true, configurable: false, enumerable: false, value: 0});    
    Object.defineProperty(currPlayer, "totalGames",{writable: true, configurable: false, enumerable: false, value: 0});
    Object.seal(currPlayer);

    let serverPlayer = {};
    Object.defineProperty(serverPlayer, "serverChoice",{writable: true, configurable: false, enumerable: false, value: "rock"});    
    Object.defineProperty(serverPlayer, "wins",{writable: true, configurable: false, enumerable: false, value: 0});    
    Object.seal(serverPlayer);

    const express = require("express");

    const app = express();

    app.use(express.urlencoded({ extended: true}));
    
    app.set("view engine", "ejs")

    app.get("/", function(req, res) {
        res.sendFile(__dirname + "/index.html");
    });

    app.post("/play", function(req,resp) {

        currPlayer.playerChoice = req.body.playerchoice;

        let x = Math.floor((Math.random() * 3) + 1);

        if (x === 1) {
            serverPlayer.serverChoice = "rock"
        }
        else if (x === 2) {
            serverPlayer.serverChoice = "paper"
        }
        else if (x === 3) {
            serverPlayer.serverChoice = "scissors"
        }
        else if (!isFinite(x)) {
            resp.status(500).send("500");
            return;
        }
        
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

        if(!isFinite(currPlayer.wins) || !isFinite(currPlayer.totalGames) || !isFinite(serverPlayer.wins)) {
            resp.status(500).send("500");
            return;
        }
        else {
            resp.render("results",{gameresult: currPlayer.gameResult, playerchoice: currPlayer.playerChoice, serverchoice: serverPlayer.serverChoice, playerwins: currPlayer.wins, serverwins: serverPlayer.wins, totalgames: currPlayer.totalGames})
        }
    });

    app.get('*', function(req, res) {
        if (req.accepts('html')) {
           res.status(404).send("404");
           return;
        }
    });

    if(!isFinite(portNumber) || portNumber !== 3000) {
        console.log("Invalid Port Number")
    }
    else {
        app.listen(portNumber);
    }
    
}

let myGame = new RPS(3000);