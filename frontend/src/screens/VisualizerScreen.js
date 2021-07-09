import React, { Component } from "react";
import classes from '../components/Grid/Grid.module.css'
import Header from '../components/Header';
import Modal from '../components/Modal/Modal';
import Grid from '../components/Grid/Grid'
import { Util } from "../Util";

const UNASSIGNED = "";

class Visualizer extends Component {
    state = {
        visualizerBoard: JSON.parse(localStorage.getItem("gameState")),
        solvingSpeed: 1,
        steps: [],
        resetDisabled: false,
        algorithm: 'Backtracking',
    };

    changeAlgorithm = (algo) => {
        this.setState({
            algorithm: algo
        })
    }

    getDeepCopyOfArray = (arr) => {
        return JSON.parse(JSON.stringify(arr));
    };

    sudokuSolver = (matrix) => {
        if (this.solveSudoku(matrix) === true) {
            this.setState({
                visualizerBoard: matrix,
            });
        }
    };

    solveSudoku = async (matrix) => {
        const steps = this.getDeepCopyOfArray(this.state.steps);
        let row = 0;
        let col = 0;
        let checkBlankSpaces = false;

        for (row = 0; row < matrix.length; row++) {
            for (col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col].value === UNASSIGNED) {
                    checkBlankSpaces = true;
                    break;
                }
            }
            if (checkBlankSpaces === true) {
                break;
            }
        }
        if (checkBlankSpaces === false) {
            steps.push("All values have been put successfully");
            this.setState({
                steps: steps,
                resetDisabled: false
            });
            return true;
        }
        for (let num = 1; num <= 9; num++) {
            if (this.isSafe(matrix, row, col, num)) {
                matrix[row][col].value = num;
                steps.push(`The Algorithm puts value = ${num} at row = ${row} and column = ${col} as it is safe to be placed at that position`);
                this.setState((prevState) => {
                    return {
                        visualizerBoard: matrix,
                        steps:steps,
                        counter: prevState.counter + 1,
                    };
                });
                await Util.sleep(this.state.solvingSpeed);
                if (await this.solveSudoku(matrix)) {
                    return true;
                }
                matrix[row][col].value = UNASSIGNED;
                steps.push(`The Algorithm tried putting value = ${num} at row = ${row} and column = ${col} but it did not lead to a final solution therefore it backtracked.Now the algorithm will try to place a different value at row = ${row} and column = ${col}`);
                this.setState((prevState) => {
                    return {
                        visualizerBoard: matrix,
                        counter: prevState.counter + 1,
                        steps: steps
                    };
                });
                await Util.sleep(this.state.solvingSpeed);
            }
        }
        return false;
    };

    isSafe = (matrix, row, col, num) => {
        return (
            !this.usedInRow(matrix, row, num) &&
            !this.usedInCol(matrix, col, num) &&
            !this.usedInBox(matrix, row - (row % 3), col - (col % 3), num)
        );
    };

    usedInRow = (matrix, row, num) => {
        for (let col = 0; col < matrix.length; col++) {
            if (matrix[row][col].value === num) {
                return true;
            }
        }
        return false;
    };

    usedInCol = (matrix, col, num) => {
        for (let row = 0; row < matrix.length; row++) {
            if (matrix[row][col].value === num) {
                return true;
            }
        }
        return false;
    };

    usedInBox = (matrix, boxStartRow, boxStartCol, num) => {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (matrix[row + boxStartRow][col + boxStartCol].value === num) {
                    return true;
                }
            }
        }
        return false;
    };

    reset = () => {
        this.setState({
            visualizerBoard:JSON.parse(localStorage.getItem("gameState")),
        });
    };

    resetSolutionSteps = () => {
        this.setState({
            steps:[]
        })
    }

    makeVisual = () => {
        this.setState({
            resetDisabled:true
        })
        const visualizerBoard = this.getDeepCopyOfArray(this.state.visualizerBoard);
        this.sudokuSolver(visualizerBoard);
    };

    changeSolvingSpeed = (speed) => {
        this.setState({
            solvingSpeed: speed
        })
    }

    render() {
        return (
            <>
                <Header changeSolvingSpeed={this.changeSolvingSpeed}
                    changeAlgorithm={this.changeAlgorithm} algorithm={this.state.algorithm}
                    visualize={this.makeVisual} resetVisualizer={this.reset} resetSolutionSteps={this.resetSolutionSteps} resetDisabled={this.state.resetDisabled} />
                <div className={classes.Board}>
                    <Grid puzzle={this.state.visualizerBoard} />
                    <Modal steps={this.state.steps} />
                </div>
            </>
        );
    }
}


export default Visualizer;
