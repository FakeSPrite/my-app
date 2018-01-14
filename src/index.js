import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props){

        return (
            <button className="square" onClick={props.onClick} style={props.style}>
                {props.value}
            </button>
        );
}

class Board extends React.Component {

    renderSquare(i) {
        var style ;
            if(this.props.change_style ==i)
            {
                style = {
                fontWeight:'900',
                    color:'red'}
            }
            else
            {
                style = this.props.style
            }
            if(this.props.winLines.includes(i))
            {
                style = {
                    fontWeight:'900',
                    color:'blue'
                }
            }

        return <Square key={i}
            value={this.props.squares[i]}
                       onClick={() => this.props.onClick(i)} style={style} />;
    }

    getBoard() {

        var rows =[];
        var count =0;
        var i =0;
        for(let r=0; r< this.props.row; r++)
        {
            i++
            var bord_html =[];
            for(let c=0; c<this.props.col; c++) {
                { bord_html.push(this.renderSquare(count))}
                count++;
            }
            {rows.push(<div className="board-row" key={i}>{bord_html}</div>)}
        }
return rows;
    }

    render() {

        return (
            <div>
                {this.getBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
            history:[{
                squares: Array(9).fill(null),
            }],
            xIsNext:true,
            location_store:[],
            stepNumber: 0,
            change_style:null,
            reverseOrder:false,
                }
    }
    handleClick(i) {
        // const history = this.state.history;
        const location = [
            '(1,1)',
            '(1,2)',
            '(1,3)',
            '(2,1)',
            '(2,2)',
            '(2,3)',
            '(3,1)',
            '(3,2)',
            '(3,3)',
        ];
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const location_store = this.state.location_store.slice(0,this.state.stepNumber );
        const current =history[history.length-1];
        const squares = current.squares.slice();
        let res = calculateWinner(squares);

        if(res||squares[i])
        {
            return
        }

        squares[i] = this.state.xIsNext?'X':'O';
        this.setState({
               history: history.concat([{
                     squares: squares
                }]),
            stepNumber: history.length,
            xIsNext:!this.state.xIsNext,
            location_store: location_store.concat(location[i]),
            change_style:i
        });

    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
            // winnerLine:[]
        });
    }
    setReverse(){
        this.setState({
            reverseOrder:!this.state.reverseOrder,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        let res = calculateWinner(current.squares);
        let winner = res?res[0]:null;
        let    winnerLine = res?res[1]:[];


        let i=0;
        const moves = history.map((step, move) => {

            const desc = move ?
                'Move #' + move +' Current location: '+this.state.location_store[move-1]:
                'Game start';
            return (
                <li key={i++}>
                    <button href="#" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                    squares={current.squares}
                    onClick={(i)=>this.handleClick(i)}
                    change_style={this.state.change_style}
                    winLines={winnerLine}
                    col={3}
                    row={3}
                    />
                </div>
                <div className="game-info">
                    <div>{status }</div>
                    <ol>{!this.state.reverseOrder?moves:moves.reverse()}</ol>
                    <ol><button onClick={()=>this.setReverse()}>reverse</button></ol>
                </div>
            </div>
        );
    }
}

// ========================================
function calculateWinner(squares) {
    // let game = Game();
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a],[a,b,c]];
        }
    }
    return null;
}
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
