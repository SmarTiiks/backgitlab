const TicTacToe = require('./models/TicTacToe');

function checkWin(grid){
    if(grid[0][0] == grid[0][1] && grid[0][1] == grid[0][2] && grid[0][0] != "0"){
        return grid[0][0];
    }
    if(grid[1][0] == grid[1][1] && grid[1][1] == grid[1][2] && grid[1][0] != "0"){
        return grid[1][0];
    }
    if(grid[2][0] == grid[2][1] && grid[2][1] == grid[2][2] && grid[2][0] != "0"){
        return grid[2][0];
    }
    if(grid[0][0] == grid[1][0] && grid[1][0] == grid[2][0] && grid[0][0] != "0"){
        return grid[0][0];
    }
    if(grid[0][1] == grid[1][1] && grid[1][1] == grid[2][1] && grid[0][1] != "0"){
        return grid[0][1];
    }
    if(grid[0][2] == grid[1][2] && grid[1][2] == grid[2][2] && grid[0][2] != "0"){
        return grid[0][2];
    }
    if(grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2] && grid[0][0] != "0"){
        return grid[0][0];
    }
    if(grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0] && grid[0][2] != "0"){
        return grid[0][2];
    }
    return "";
}

function doAll(app){

    app.get('/TicTacToe/createGrid', function(req, res){
        const Data = new TicTacToe({
            grid: [
                ["0", "0", "0"],
                ["0", "0", "0"],
                ["0", "0", "0"]
            ],
            finished: false,
            winner: "",
            player1: {
                username: "Player1",
                score: 0
            },
            player2: {
                username: "Player2",
                score: 0
            },
            turn: "",
            playersinit: false
        });
        Data.save()
        .then(result => {
            console.log('Grid created');
            res.redirect('http://localhost:3000/TicTacToe');
        }).catch(err => {
            console.log(err);
        });
        });

    app.get('/TicTacToe/getGrid', function(req, res){
        TicTacToe.findOne().then(dataset => {
            res.json(dataset);
        }).catch(err => {
            console.log(err);
        });
        
    });

    app.post('/TicTacToe/updateGrid/', function(req, res){
        // console.log(req.body);
        TicTacToe.findOne()
        .then(dataset => {
            // newGrid = dataset.grid;
            // for (let index = 0; index < req.grid.length; index++) {
            //     newGrid[~~(index/3)][index] = req.grid[index];
            // }
            TicTacToe.updateOne({},
                {
                    grid: req.body.grid,
                    // grid: newGrid
            }).then(result => {
                console.log('Grid updated');
                res.redirect('http://localhost:3000/TicTacToe');
            }).catch(err => {
                console.log(err);
            });       
        });
        });

    app.post('/TicTacToe/resetGrid', function(req, res){
            TicTacToe.updateOne({},
                {grid: [
                    ["0", "0", "0"],
                    ["0", "0", "0"],
                    ["0", "0", "0"]
                ],
            }).then(result => {
                console.log('Grid updated');
                res.redirect('http://localhost:3000/TicTacToe');
            }).catch(err => {
                console.log(err);
            });       
        });
    
    app.post('/TicTacToe/updateWinner/:id', function(req, res){
        TicTacToe.findOne({
            _id: req.params.id}
        ).then(result => {
            var winner = checkWin(result.grid);
            if(winner != ""){
                TicTacToe.updateOne({
                    _id: req.params.id},
                    {winner: winner,
                    finished: true
                }).then(result => {
                    console.log('Winner updated');
                    res.redirect('/TicTacToe/updateScore/'+req.params.id);
                }).catch(err => {
                    console.log(err);
                });       
            }
            res.redirect('http://localhost:3000/TicTacToe')
        }).catch(err => {
            console.log(err);
        });       
    });

    app.post('/TicTacToe/updateScore/:id', function(req, res){
        TicTacToe.findOne({
            _id: req.params.id}
        ).then(result => {
            if(result.winner == "1"){
                TicTacToe.updateOne({
                    _id: req.params.id},
                    {player1: {
                        username: result.player1.username,
                        score: result.player1.score + 1
                    }
                }).then(result => {
                    console.log('Score updated');
                    res.redirect('http://localhost:3000/TicTacToe');
                }).catch(err => {
                    console.log(err);
                });       
            } else if(result.winner == "2"){
                TicTacToe.updateOne({
                    _id: req.params.id},
                    {player2: {
                        username: result.player2.username,
                        score: result.player2.score + 1
                    }
                }).then(result => {
                    console.log('Score updated');
                    res.redirect('http://localhost:3000/TicTacToe');
                }).catch(err => {
                    console.log(err);
                });       
            }
        }).catch(err => {
            console.log(err);
        });       
    })

}

exports.doAll = doAll;