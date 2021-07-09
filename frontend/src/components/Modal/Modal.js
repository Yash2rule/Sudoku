import React from 'react'
import classes from './Modal.module.css';

const Modal = ({ steps }) => {
    return (
        <>
        {steps.length > 0 && (
            <div className={classes.Container}>
            <h2 style={{padding: '5px'}}>Solution Steps</h2>
            <p style={{fontSize: '24px'}}>(concised)</p>
                {steps.map(step => (
                    <ul className="list-group" key={step}>
                      <li className="list-group-item my-1" style={{ fontSize: '18px',border: '2px solid black',backgroundColor: 'white',margin:'10px' }}><b>Step {steps.indexOf(step)+1}</b>:{' '}{step}</li>
                    </ul>
                ))}
            </div>
        )}
        </>
    )
}

export default Modal
