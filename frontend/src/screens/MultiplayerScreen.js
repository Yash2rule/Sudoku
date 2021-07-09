import React, { Component } from "react";
import { withRouter } from "react-router";
import {Form , Button} from 'react-bootstrap';
import Header from "../components/Header";
import FormContainer from "../components/FormContainer";

class MultiplayerScreen extends Component {

  state = {
    name:'',
    room:''
  };

  getDeepCopyOfArray = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  };

  createRoom = () => {
    if(this.state.name !== '' && this.state.room !== ''){
      this.props.history.push({
        pathname: `/arena`,
        search:`?room=${this.state.room}&name=${this.state.name}`
      })
    }
  }

  render() {
    return (
      <>
      <Header />
      <FormContainer>
            <h1>Enter Room Details</h1>
            <Form>
                <Form.Group controlId='name'>
                    <Form.Label style={{fontWeight:'bold'}}>Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter name'
                    value={this.state.name} onChange={(e) => {
                      this.setState({
                        name:e.target.value
                      })
                    }}>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='room'>
                <Form.Label style={{fontWeight:'bold'}}>Room Name</Form.Label>
                    <Form.Control as='select' value={this.state.room} onChange={(e) => {
                      this.setState({
                        room:e.target.value
                      })
                    }}>
                        <option value="0">Enter Room Name</option>
                        <option value="BatCave">BatCave</option>
                        <option value="DeathStar">DeathStar</option>
                        <option value="Hall of Justice">Hall of Justice</option>
                        <option value="Spider Skull Island">Spider Skull Island</option>
                        <option value="Thunderdome">Thunderdome</option>
                        <option value="Rusty Cage">Rusty Cage</option>
                        <option value="Bunker">Bunker</option>
                        <option value="Lockdown Bar">Lockdown Bar</option>
                        <option value="Gamer's Paradise">Gamer's Paradise</option>
                        <option value="Arcade Brothers">Arcade Brothers</option>
                  </Form.Control>
                </Form.Group>
                <Button type='button' variant='dark' onClick={this.createRoom}>Enter Room</Button>
            </Form>
        </FormContainer>
      </>
    )
  }
}

export default withRouter(MultiplayerScreen);
