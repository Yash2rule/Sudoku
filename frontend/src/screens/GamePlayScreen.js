import React, { Component } from "react";
import { withRouter } from "react-router";
import {Alert} from 'react-bootstrap';
import io from "socket.io-client";
import Qs from "query-string";
import classes from '../components/Grid/Grid.module.css'
import Header from "../components/Header";
import Grid from "../components/Grid/Grid";
import './Multiplayer.css';


class GamePlayScreen extends Component {
  _isMounted = false;
 
  state = {
    puzzle: JSON.parse(localStorage.getItem("gameState")),
    activeElementPosition: [0, 0],
    difficulty:"easy",
    socket:io("http://localhost:5000"),
    message:'',
    name:Qs.parse(this.props.location.search).name,
    room:Qs.parse(this.props.location.search).room,
    users:[],
    show:false,
    complete:false
  };

  componentDidMount() {
    this._isMounted = true;
    this.state.socket.emit('joinRoom',  {room:this.state.room,username:this.state.name})
    const puzzle = this.getDeepCopyOfArray(this.state.puzzle)
    this.state.socket.emit('grid',{puzzle});
    this.state.socket.on('gridUpdate',(puzzle) => {
      if(this._isMounted){
        this.setState({
          puzzle: puzzle
        })
      }
    })
    this.state.socket.on('message',(message) => {
        this.showAlert()
        if(this._isMounted){
          this.setState({
            message: message
          })
        }
    })
    this.state.socket.on('win',() => {
      if(this._isMounted){
        this.setState({
          complete: true
        })
      }
    })
    this.state.socket.on('roomusers', ({ room, users }) => {
      if(this._isMounted){
        this.setState({
          users: users,
          room: room
        })
      }
    })
  }


  componentWillUnmount() {
    this.state.socket.disconnect();
    this._isMounted = false;
  }

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

  isValidInput = (i) => {
    return i === "" || (i.length === 1 && this.isNumeric(i));
  };

  isNumeric = (num) => {
    return !isNaN(num);
  };

  setActiveElementPosition = (idx, col) => {
    this.setState({
      activeElementPosition: [idx, col],
    });
  }

  onValueChanged = (event, rowNum, colNum) => {
    this.setState((prevState) => {
      const puzzle = this.getDeepCopyOfArray(prevState.puzzle);
      puzzle[rowNum][colNum].value = event.target.value;
      if (this.isValidInput(puzzle[rowNum][colNum].value)) {
          this.state.socket.emit('grid',{puzzle})
          if(this.checkForCompletion(puzzle)){
            this.state.socket.emit('completion')
            return {
              puzzle: puzzle,
              activeElementPosition: [rowNum, colNum],
              complete: true
            }
          }else{
            return {
              puzzle: puzzle,
              activeElementPosition: [rowNum, colNum],
              complete:false
            }
          }
      }
      if(this.state.complete){
        setTimeout(() => {
          this.setState({
            complete:false
          })
        },10000)
      }
    });
  };

  showAlert = (seconds = 5000) => {
    this.setState({
      show:true
    })
    setTimeout(() => {
      this.setState({
        show:false,
        message:''
      })
    },seconds)
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

  render() {
    return (
    <>
      <Header />
      {this.state.complete && (
      <div className='at-container'>
        <h1 className='at-item'>Congratulations to all the room members on solving the puzzle!
        </h1>
      </div>)}
        <div className="slide-right" style={{textAlign: 'center'}}>
          <h5>Invite other players by making them join with the Room Name: <b>{this.state.room}</b></h5>
        </div>
      {this.state.show && (
          <Alert variant='dark' style={{width:'100%',margin: 'auto',textAlign:'center'}}>
            {this.state.message}
          </Alert>
          )}
        <div className={classes.Board}>
        <main className="chat-main" style={{marginLeft:'5%'}}>
            <div className="chat-sidebar">
                <h3><i className="fas fa-comments"></i> Room Name</h3>
                <h2 id="room-name">{this.state.room}</h2>
                <h3><i className="fas fa-users"></i> Users</h3>
                <ul id="users">
                  {this.state.users && this.state.users.map(user => (
                    <li key={user.id}><h5 id="room-name">{user.username}</h5></li>
                  ))}
                </ul>
            </div>
          </main>
          <Grid puzzle={this.state.puzzle} 
          setActiveElementPosition={this.setActiveElementPosition} onValueChanged={this.onValueChanged} />
        </div>
      </>
    )
  }
}

export default withRouter(GamePlayScreen);
