import React, { useEffect, useState } from 'react';

const App = () => {
    const [colorState, setColorState] = useState();
    const [animationState, setAnimationState] = useState();
    const [animationSpeedState, setAnimationSpeedState] = useState();

    const getState = () => {
        fetch("https://192.168.86.161/lights")
            .then(res => res.json())
            .then(data => {
                setColorState(data.colors.join(","));
                setAnimationState(data.animation);
                setAnimationSpeedState(data.animationSpeed);
            });
    };

    const setState = (data) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch('https://192.168.86.161/lights', requestOptions)
            .then(response => response.json())
            .then(data => {
                setColorState(data.colors.join(","));
                setAnimationState(data.animation);
                setAnimationSpeedState(data.animationSpeed);
            });
    };

    const getPersistence = () => {
        fetch("https://192.168.86.161/persistence")
            .then(res => res.text())
            .then(text => console.log(text));
    };

    const deletePersistence = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('https://192.168.86.161/persistence', requestOptions)
            .then(() => console.log("file deleted!"));
    };

    useEffect(getState, []);

    return (
        <div className="container text-center">
            <h1>MyKy Christmas Smart Control - Christmas Lights</h1>
            
            <h4>Current colors: {colorState || 'N/A'}</h4>
            <h4>Current animation: {animationState || 'N/A'}</h4>
            <h4>Current animation speed: {animationSpeedState || 'N/A'}</h4>
            
            <p>
                <button
                    type="button"
                    className="btn btn-danger btn-large"
                    onClick={() => setState({colors: ['ff0000'], animation: 0})}
                >
                    Static Red
                </button>
                <button
                    type="button"
                    className="btn btn-success btn-large"
                    onClick={() => setState({colors: ['00ff00'], animation: 0})}
                >
                    Static Green
                </button>
                <button
                    type="button"
                    className="btn btn-secondary btn-large"
                    onClick={() => setState({colors: ['ff0000','00ff00','0000ff'], animation: 1, animationSpeed: 1})}
                >
                    Rotate Multi-Color
                </button>
                <button
                    type="button"
                    className="btn btn-secondary btn-large"
                    onClick={() => setState({colors: ['ff0000','00ff00','0000ff'], animation: 1, animationSpeed: 0.5})}
                >
                    Slow Rotate Multi-Color
                </button>
                <button
                    type="button"
                    className="btn btn-secondary btn-large"
                    onClick={() => setState({colors: ['ff0000','00ff00','0000ff'], animation: 2, animationSpeed: 2})}
                >
                    Fast Rotate Multi-Color w/ White
                </button>
            </p>
            <p>
                <button
                    type="button"
                    className="btn btn-warning btn-large"
                    onClick={() => getPersistence()}
                >
                    Get Persistence
                </button>
                <button
                    type="button"
                    className="btn btn-warning btn-large"
                    onClick={() => deletePersistence()}
                >
                    Delete Persistence
                </button>
            </p>
            <img src="https://i.imgur.com/z9HYCt0.jpg" className="img-fluid" alt="Christmas Doggy" />
        </div>
    );
}

export default App;
