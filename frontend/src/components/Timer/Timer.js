import React, { useEffect } from 'react'
import classes from './Timer.module.css'
const Timer = ({ isPaused }) => {
    const [time, setTime] = React.useState(0)
    const [timeoutID, setTimeOutId] = React.useState(null)

    useEffect(() => {
        if (!isPaused) {
            setTimeOutId(startTimer())
        } else {
            stopTimer()
        }
        return () => {
            setTimeOutId(null);
        }
    }, [time, isPaused])

    function stopTimer() {
        clearTimeout(timeoutID)
    }

    function startTimer() {
        setTimeout(() => {
            setTime(time + 1);
        }, 1000)
    }

    function secondsToHms(d) {
        d = Number(d);
        var h = "0" + Math.floor(d / 3600);
        var m = "0" + Math.floor((d % 3600) / 60);
        var s = "0" + Math.floor((d % 3600) % 60);
        if (m > 9) {
            m = Math.floor((d % 3600) / 60);
        }
        if (s > 9) {
            s = Math.floor((d % 3600) % 60);
        }
        if (h > 9) {
            h = Math.floor(d / 3600);
        }
        return h + ":" + m + ":" + s;
    }

    return (
        <div className={classes.time}>
            <div>{secondsToHms(time)}</div>
        </div>
    )
}

export default Timer
