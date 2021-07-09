import React from 'react'
import { withRouter } from 'react-router-dom'
import classes from './Grid.module.css'
const Grid = ({ history, puzzle, getConflicts, onValueChanged, setActiveElementPosition }) => {
  return (
    <table className={classes.Table}>
      <tbody>
        {puzzle.map((row, idx) => (
          <tr key={idx} className={classes.TableRow}>
            {row.map((cell, col) => (
              <td key={col} className={classes.TableData}>
                {history.location.pathname === '/' || history.location.pathname === '/arena' ? (puzzle[idx][col].prefilled ? (
                  <div className={puzzle[idx][col].prefilled ? classes.TableDiv : classes.Input}>
                    {puzzle[idx][col].value}
                  </div>
                ) : (
                  <input
                    className={
                      getConflicts && getConflicts()
                        ? classes.Conflict
                        : classes.Input
                    }
                    value={puzzle[idx][col].value}
                    onFocus={(event) => {
                      setActiveElementPosition(idx, col);
                    }}
                    onChange={(event) => {
                      onValueChanged && onValueChanged(event, idx, col);
                    }}
                  />
                )) : (
                  <div className={puzzle[idx][col].prefilled ? classes.TableDiv : classes.TableEmpty}>
                    {puzzle[idx][col].value}
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table> 
  )
}

export default withRouter(Grid)
