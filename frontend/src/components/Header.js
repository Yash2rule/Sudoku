import React from 'react'
import {Link,withRouter } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap';
import Timer from '../components/Timer/Timer'
const Header = ({ history, initialPuzzle, generateAccordingToDifficulty, setDifficulty, undo, redo, reset, showHint, solve, togglePause, changeSolvingSpeed,visualize,isPaused,resetVisualizer,resetSolutionSteps,resetDisabled,multiplayerRedirect }) => {
    const path = history.location.pathname
    const visualizeHandler = () => {
        history.push({
            pathname: '/visualizer',
            state: {
                puzzle: initialPuzzle,
            }
        });
    }
    return (
        <header>
            <Navbar className="p-3" style={{width:'100%'}} bg="dark" variant="dark" expand="lg" collapseOnSelect>
                {path === '/multiplayer' || path === '/arena'? (
                    <>
                    {path === '/arena' ? (
                        <Link to='/multiplayer' className='btn btn-secondary'>
                        <i className="fas fa-arrow-alt-circle-left"></i>{' '}Quit
                        </Link>
                    ):(
                        <Link to='/' className='btn btn-secondary'>
                        <i className="fas fa-arrow-alt-circle-left"></i>{' '}Go Back
                        </Link>
                    )}
                    <Navbar.Brand href="#" style={{ color: 'white',fontSize: '2.5em',margin: 'auto',fontFamily: 'serif'}} onClick={(e) => {
                        history.push('/')
                        e.preventDefault();
                    }}>Sudoku</Navbar.Brand>
                    </>
                ):(
                    <>
                    {path === '/visualizer' && (
                        <Link to='/' className='btn btn-secondary' style={{margin: 'auto'}}>
                            <i className="fas fa-arrow-alt-circle-left"></i>{' '}Go Back
                        </Link>
                    )}
                    <Container>
                    <Navbar.Brand href="/" style={{ color: 'white', fontSize: '2.5em',fontFamily:'serif' }} onClick={(e) => {
                        e.preventDefault();
                    }}>Sudoku</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            {path === '/visualizer' ? null : (
                                <Nav.Link href="#" style={{ color: 'white', fontSize: '1.5em', margin: '5px' }} onClick={(e) => {
                                    e.preventDefault();
                                    generateAccordingToDifficulty()
                                }}>Generate Puzzle</Nav.Link>
                            )}
                            {path === '/visualizer' ? null : (
                                <NavDropdown title="Difficulty" id="basic-nav-dropdown" style={{ color: 'white', fontSize: '1.5em', margin: '5px' }}>
                                    <NavDropdown.Item as='button' onClick={() => setDifficulty("easy")}>Easy</NavDropdown.Item>
                                    <NavDropdown.Item as='button' onClick={() => setDifficulty("medium")}>Medium</NavDropdown.Item>
                                    <NavDropdown.Item as='button' onClick={() => setDifficulty("hard")}>Hard</NavDropdown.Item>
                                    <NavDropdown.Item as='button' onClick={() => setDifficulty("random")}>Random</NavDropdown.Item>
                                </NavDropdown>
                            )}
                            {path === '/visualizer' ? (
                                <NavDropdown title="Speed" id="basic-nav-dropdown" style={{ color: 'white', fontSize: '1.5em', margin: '5px' }}>
                                    <NavDropdown.Item as='button' onClick={() => { changeSolvingSpeed(10) }}>Fast</NavDropdown.Item>
                                    <NavDropdown.Item as='button' onClick={() => { changeSolvingSpeed(650) }}>Medium</NavDropdown.Item>
                                    <NavDropdown.Item as='button' onClick={() => { changeSolvingSpeed(1000) }}>Slow</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <NavDropdown title="Tools" id="basic-nav-dropdown" style={{ color: 'white', fontSize: '1.5em', margin: '5px' }}>
                                    <NavDropdown.Item as='button' onClick={undo}>Undo</NavDropdown.Item>
                                    <NavDropdown.Item as='button' onClick={redo}>Redo</NavDropdown.Item>
                                    <NavDropdown.Item as='button' onClick={reset}>Reset</NavDropdown.Item>
                                    <NavDropdown.Item as='button' onClick={showHint}>Hint</NavDropdown.Item>
                                    <NavDropdown.Item as='button' onClick={solve}>Solve</NavDropdown.Item>
                                </NavDropdown>
                            )}
                            {path === '/visualizer' ? null: (
                                <Nav.Link href="#" style={{ color: 'white', fontSize: '1.5em', margin: '5px' }} onClick={(e) => {
                                    e.preventDefault();
                                    togglePause()
                                }}>{isPaused ? 'Resume' : 'Pause'}</Nav.Link>
                            )}
                        </Nav>
                        {path === '/visualizer' && (
                            <Button className="btn btn-secondary mx-3"
                            style={{ color: 'white', fontSize: '1.5em' }}
                            onClick={() => {
                                resetVisualizer();
                                resetSolutionSteps();
                            }} disabled={resetDisabled}>
                                Reset
                            </Button>
                        )}
                        <Button className="btn btn-secondary mx-3" style={{ color: 'white', fontSize: '1.5em' }} onClick={path === '/' ? visualizeHandler : visualize}>Visualize</Button>
                        {path === '/' && (
                            <Button className="btn btn-secondary mx-3" style={{ color: 'white', fontSize:'1.5em'}} onClick={multiplayerRedirect}>Multiplayer</Button>
                        )}
                    </Navbar.Collapse>
                </Container>
                </>
                )}
                {path === '/' && <Timer isPaused={isPaused}/>}
            </Navbar>
        </header>
    )
}

export default withRouter(Header)
