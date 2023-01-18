const game = document.getElementById('game')
const result = document.getElementById('result')
const aiPlayer = 'x', huPlayer = 'o'
const resetBtn = document.getElementById('reset')


class Game {
    constructor(size = 3) {
        this.size = size
        this.turn = Math.floor(Math.random() * 2)
        this.turnCount = 0

        resetBtn.addEventListener('click', () => {
            this.resetGame()
        })

        this.cellList = []
        this.resetGame()
    } 

    get limit() {
        return this.size * this.size
    }

    init() {
        for (let i = 0; i < this.limit; i++) {
            const cell = document.createElement('div')
            cell.setAttribute('data-id', i)
            cell.addEventListener('click', this.humanPlay())
            game.appendChild(cell)
            this.cellList.push(cell)            
        }
    }

    resetGame() {
        this.board = [...Array(this.limit).keys()]
        this.cellList = []
        result.innerHTML = ''
        game.innerHTML = ''
        this.turnCount = 0
        this.init()
    }

    humanPlay() {
        return (e) => {
            this.turnCount += 1
            const id = e.target.getAttribute('data-id')
            this.board[+id] = huPlayer
            this.cellList[+id].innerHTML = `<span>${huPlayer}</span>`
            if(this,this.turnCount >= this.limit) {
                result.innerHTML = '<h4>Drawl!</h4>'
                return
            }
            if (this.checkWinner(this.board, huPlayer)) {
                result.innerHTML = '<h4>You Win!</h4>'
                return
            }
            const bestMove = this.minimax(this.board, aiPlayer)
            this.board[bestMove.idx] = aiPlayer
            this.cellList[bestMove.idx].innerHTML = `<span>${aiPlayer}</span>`
            if (this.checkWinner(this.board, aiPlayer)) {
                result.innerHTML = '<h4>AI Win!</h4>'
                return
            }
        }
    }

    checkWinner(board, player) {
        if (board[0] === player && board[1] === player && board[2] === player ||
            board[3] === player && board[4] === player && board[5] === player ||
            board[6] === player && board[7] === player && board[8] === player ||
            board[0] === player && board[3] === player && board[6] === player ||
            board[1] === player && board[4] === player && board[7] === player ||
            board[2] === player && board[5] === player && board[8] === player ||
            board[0] === player && board[4] === player && board[8] === player ||
            board[2] === player && board[4] === player && board[6] === player ) {
            return true 
        }
        return false
    }
    
    minimax(board, player) {
        if (this.checkWinner(board, huPlayer)) {
            return { score: -1 }
        }
        if (this.checkWinner(board, aiPlayer)) {
            return { score: 1 }
        }
        const emptyCells = this.findEmptyCells(board)
        if (emptyCells.length === 0) {
            return {score: 0}
        }

        let moves = []
        for (let i = 0; i < emptyCells.length; i++) {
            let move = {}
            board[emptyCells[i]] = player
            move.idx = emptyCells[i]
            if(player === huPlayer) {
                const payload = this.minimax(board, aiPlayer)
                move.score = payload.score
            }           
            if(player === aiPlayer) {
                const payload = this.minimax(board, huPlayer)  
                move.score = payload.score
            }
            board[emptyCells[i]] = move.idx
            moves.push(move)
        }

        let bestMove = null

        if (player === aiPlayer) {
                var bestScore = -Infinity;
                for (var i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            } else { 
                var bestScore = Infinity
                for (var i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }                    
                }
            }
        return moves[bestMove]
    }

    findEmptyCells(board) {
        return board.filter(c => c !== huPlayer &&  c !== aiPlayer)
    }
}

new Game()