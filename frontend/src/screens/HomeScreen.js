import React, { Component } from "react";
import classes from '../components/Grid/Grid.module.css'
import Header from "../components/Header";
import Grid from "../components/Grid/Grid";
import sudokuSolver from "../Backtracking";
import './Multiplayer.css';

const exampleGrid =  [[0, 0, 0, 0, 0, 0, 0, 1, 0],
                      [2, 1, 0, 0, 0, 3, 4, 8, 0],
                      [0, 3, 9, 8, 0, 0, 2, 0, 0],
                      [0, 6, 0, 3, 0, 4, 9, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 1, 6, 0, 7, 0, 4, 0],
                      [0, 0, 8, 0, 0, 2, 1, 7, 0],
                      [0, 2, 6, 7, 0, 0, 0, 9, 8],
                      [0, 9, 0, 0, 0, 0, 0, 0, 0]]


class board extends Component {
  state = {
    puzzle: [],
    solution: [],
    initialPuzzle: null,
    history: [],
    future: [],
    activeElementPosition: [0, 0],
    undoDisabled: false,
    redoDisabled: false,
    paused: false,
    difficulty: "easy",
    complete:false
  };

  componentDidMount() {
    const currentGameState = JSON.parse(localStorage.getItem("gameState")) ? JSON.parse(localStorage.getItem("gameState")) : null;
    if(currentGameState === null){
    fetch("https://sugoku.herokuapp.com/board?difficulty=" + this.state.difficulty)
      .then((response) => response.json())
      .then((data) => {
        const board = data.board;
        const puzzle = this.initialize(board);
        localStorage.setItem("gameState",JSON.stringify(puzzle));
        const solution = sudokuSolver(board);
        const updatedSolution = this.initialize(solution);
        this.setState({
          puzzle: puzzle,
          initialPuzzle: puzzle,
          solution:updatedSolution
        });
      })
      .catch((error) => {
          if(error){
            const puzzle = this.initialize(exampleGrid);
            localStorage.setItem("gameState",JSON.stringify(puzzle));
            const solution = sudokuSolver(exampleGrid);
            const updatedSolution = this.initialize(solution);
            this.setState({
              puzzle: puzzle,
              initialPuzzle: puzzle,
              solution:updatedSolution
            });
          }
      });
    }else{
      const flattenedboard = this.flattenPuzzle(currentGameState)
      const solution = sudokuSolver(flattenedboard);
      const updatedSolution = this.initialize(solution);
      this.setState({
          puzzle: currentGameState,
          initialPuzzle: currentGameState,
          solution:updatedSolution
      });
    }
  }

  flattenPuzzle = (puzzle) => {
    const arr = [];
    for(let i = 0; i < 9; i++){
      arr.push([])
    }
    for(let i = 0; i < 9 ; i++){
      for (let j = 0; j < 9; j++) {
        if(puzzle[i][j].value === ""){
          arr[i].push(0)
        }else{
          arr[i].push(puzzle[i][j].value);
        }
      }
    }
    return arr;
  }
  
  generateAccordingToDifficulty = () => {
    fetch("https://sugoku.herokuapp.com/board?difficulty=" + this.state.difficulty)
      .then((response) => response.json())
      .then((data) => {
        const board = data.board;
        const puzzle = this.initialize(board);
        localStorage.setItem("gameState",JSON.stringify(puzzle));
        const solution = sudokuSolver(board);
        const updatedSolution = this.initialize(solution);
        this.setState({
          puzzle: puzzle,
          initialPuzzle: puzzle,
          solution:updatedSolution,
          complete:false
        });
      })
      .catch((error) => {
        if(error){
          const puzzle = this.initialize(exampleGrid);
          localStorage.setItem("gameState",JSON.stringify(puzzle));
          const solution = sudokuSolver(exampleGrid);
          const updatedSolution = this.initialize(solution);
          this.setState({
            puzzle: puzzle,
            initialPuzzle: puzzle,
            solution:updatedSolution
          });
        }
      });
  };

  setDifficulty = (value) => {
    this.setState({
      difficulty: value,
    });
  };

  initialize = (board) => {
    const updatedPuzzle = [];
    const puzz = board;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzz[i][j] === 0) {
          updatedPuzzle.push({ value: "", prefilled: false });
        } else {
          updatedPuzzle.push({ value: puzz[i][j], prefilled: true });
        }
      }
    }
    const updatedPuzz = this.oneToTwoD(updatedPuzzle, 9);
    return updatedPuzz;
  };
 
  oneToTwoD(arr, num) {
    var twoD = [],
      i,
      j;
    for (i = 0, j = -1; i < arr.length; i++) {
      if (i % num === 0) {
        j++;
        twoD[j] = [];
      }

      twoD[j].push(arr[i]);
    }
    return twoD;
  }

  getDeepCopyOfArray = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  };
  onValueChanged = (event, rowNum, colNum) => {
    this.setState((prevState) => {
      const puzz = this.getDeepCopyOfArray(prevState.puzzle);
      puzz[rowNum][colNum].value = event.target.value;
      if (this.isValidInput(puzz[rowNum][colNum].value)) {
        const hist = this.getDeepCopyOfArray(prevState.history);
        hist.push(prevState.puzzle);
        if(this.checkForCompletion(puzz)){
          return {
            puzzle: puzz,
            activeElementPosition: [rowNum, colNum],
            history: hist,
            complete: true
          }
        }else{
          return {
            puzzle: puzz,
            activeElementPosition: [rowNum, colNum],
            history: hist,
            complete:false
          }
        }
      }
      if(this.state.complete){
        setTimeout(() => {
          this.setState({
            complete:false,
          })
        },10000)
        
      }
    });
  };

  isValidInput = (i) => {
    return i === "" || (i.length === 1 && this.isNumeric(i));
  };

  isNumeric = (num) => {
    return !isNaN(num);
  };

  undo = () => {
    const history = this.getDeepCopyOfArray(this.state.history)
    if(history.length > 0){
      this.setState((prevState) => {
        const puzz = this.getDeepCopyOfArray(this.state.puzzle);
        const newHistory = this.getDeepCopyOfArray(prevState.history);
          const newFuture = this.getDeepCopyOfArray(prevState.future);
          newFuture.push(puzz);
          const lastBoardState = newHistory.pop();
          return {
            puzzle: lastBoardState,
            history: newHistory,
            future: newFuture,
            undoDisabled: false,
          };
      });
    }
  };


  redo = () => {
    this.setState((prevState) => {
      const puzz = this.getDeepCopyOfArray(this.state.puzzle);
      const history = this.getDeepCopyOfArray(prevState.history);
      const newFuture = this.getDeepCopyOfArray(prevState.future);
      if (newFuture.length > 0) {
        history.push(puzz)
        const futureBoardState = newFuture.pop();
        return {
          puzzle: futureBoardState,
          future: newFuture,
          history:history,
          redoDisabled: false,
        };
      } else {
        const puzz = this.getDeepCopyOfArray(this.state.puzzle);
        return { puzzle: puzz, redoDisabled: true };
      }
    });
  };

  findRowConflict = () => {
    const puzz = this.getDeepCopyOfArray(this.state.puzzle);
    const activeElementPositions = this.getDeepCopyOfArray(
      this.state.activeElementPosition
    );
    const row = activeElementPositions[0];
    const col = activeElementPositions[1];
    for (let i = 0; i < 9; i++) {
      if (i !== col) {
        if (puzz[row][col].value !== "") {
          if (puzz[row][col].value == puzz[row][i].value) {
            return true;
          }
        }
      }
    }
    return false;
  };

  findColumnConflict = () => {
    const activeElementPositions = this.getDeepCopyOfArray(
      this.state.activeElementPosition
    );
    const row = activeElementPositions[0];
    const col = activeElementPositions[1];
    const puzz = this.getDeepCopyOfArray(this.state.puzzle);
    for (let i = 0; i < 9; i++) {
      if (i !== row) {
        if (puzz[row][col].value !== "") {
          if (puzz[row][col].value == puzz[i][col].value) {
            return true;
          }
        }
      }
    }
    return false;
  };

  findMatrixConflict = () => {
    const puzz = this.getDeepCopyOfArray(this.state.puzzle);
    const activeElementPositions = this.getDeepCopyOfArray(
      this.state.activeElementPosition
    );
    const row = activeElementPositions[0];
    const col = activeElementPositions[1];
    const sgr = Math.floor(row / 3);
    const sgc = Math.floor(col / 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          puzz[row][col].value !== "" &&
          3 * sgr + i !== row &&
          3 * sgc + j !== col
        ) {
          if (puzz[row][col].value == puzz[3 * sgr + i][3 * sgc + j].value) {
            return true;
          }
        }
      }
    }
    return false;
  };

  getConflicts = () => {
    //const res = this.findRowConflict() || this.findColumnConflict() || this.findMatrixConflict();
    const rowConflict = this.findRowConflict();
    const columnConflict = this.findColumnConflict();
    const matrixConflict = this.findMatrixConflict();
    const combinedConflicts = rowConflict || columnConflict || matrixConflict;
    if (combinedConflicts) {
      return true;
    } else {
      return false;
    }
  };

  solve = () => {
    const solution = this.getDeepCopyOfArray(this.state.solution)
    this.setState({
      puzzle: solution
    });
  };

  reset = () => {
    this.setState({
      puzzle: this.state.initialPuzzle,
    });
  };

  setActiveElementPosition = (idx, col) => {
    this.setState({
      activeElementPosition: [idx, col],
    });
  }

  showHint = () => {
    const activeElePos = this.getDeepCopyOfArray(this.state.activeElementPosition);
    const idx = activeElePos[0];
    const col = activeElePos[1];
    const solution = this.getDeepCopyOfArray(this.state.solution);
    const puzz = this.getDeepCopyOfArray(this.state.puzzle);
    puzz[idx][col].value = solution[idx][col].value;
    this.setState({
      puzzle: puzz,
    });
  };

  togglePause = () => {
    this.setState(prevState => {
      return {
        paused: !prevState.paused
      }
    })
  }

  checkForCompletion = (puzzle) => {
    const maxSumOfAllCells = 405;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          sum = sum + Number(puzzle[i][j].value);
      }
    }
    if(sum === maxSumOfAllCells){
      return true;
    }else{
      return false;
    }
  }

  multiplayerRedirect = () => {
    const initialPuzzle = this.getDeepCopyOfArray(this.state.initialPuzzle);
    this.props.history.push({
      pathname: '/multiplayer',
      state: {
          puzzle: initialPuzzle,
      }
  });
  }

  render() {
    return (
      <>
        <Header initialPuzzle={this.state.initialPuzzle}
          generateAccordingToDifficulty={this.generateAccordingToDifficulty}
          setDifficulty={this.setDifficulty} undo={this.undo} redo={this.redo}
          reset={this.reset} showHint={this.showHint} solve={this.solve}
          togglePause={this.togglePause} isPaused={this.state.paused} multiplayerRedirect={this.multiplayerRedirect} />
        {this.state.complete && (
        <div className='at-container'>
          <h1 className='at-item'>You Won!
          </h1>
        </div>)}
        <div className={classes.Board}>
          {this.state.paused ? (
              <h2 style={{textAlign: 'center',animation: 'slide-right 5s infinite',transform: 'translateX(-100%)'}}>The Game is paused , Click on <b>Resume</b> button present in the navigation bar to continue playing</h2>
          ):(
            <Grid puzzle={this.state.puzzle} getConflicts={this.getConflicts}
            setActiveElementPosition={this.setActiveElementPosition}
            onValueChanged={this.onValueChanged} />
          )}
        </div>
      </>
    );
  }
}

export default board;
