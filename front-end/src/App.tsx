import React, { useEffect, useState } from 'react';
import { deletePersistence, getLightsState, getPersistence, setLightsState } from './api';
import { LightsState, Animation } from './types';

const App = () => {
    const [colorsState, setColorsState] = useState<string[]>();
    const [animationState, setAnimationState] = useState<number>();
    const [animationSpeedState, setAnimationSpeedState] = useState<number>();

    const [formColors, setFormColors] = useState<string>('');
    const [formAnimation, setFormAnimation] = useState<Animation>(Animation.Static);
    const [formAnimationSpeed, setFormAnimationSpeed] = useState<string>('1');

    const [showPersistenceControls, setShowPersistenceControls] = useState<boolean>(false);

    const updateLocalState = (newState: LightsState) => {
        setColorsState(newState.colors);
        setAnimationState(newState.animation);
        setAnimationSpeedState(newState.animationSpeed);

        // Set the form values
        setFormColors(newState.colors.join(','));
        setFormAnimation(newState.animation);
        setFormAnimationSpeed(newState.animationSpeed.toString());
    };

    const handleGetState = () => {
        getLightsState()
            .then((newState) => updateLocalState(newState));    
    };

    const handleSetState = (newState: LightsState) => {
        if (newState.colors && newState.colors.find(c => !c.match(/[0-9a-fA-Z]{6}/))) {
            alert("Invalid color! Must be HTML hex color code");
            return;
        }

        setLightsState(newState)
            .then(newState => {
                updateLocalState(newState);
            });
    };

    const handleGetPersistence = () => {
        getPersistence()
            .then(text => console.log(text));
    };

    const handleDeletePersistence = () => {
        deletePersistence()
            .then(() => console.log("file deleted!"));
    };

    const handleUpdateLights = () => {
        const formAnimationSpeedAsNum = Number(formAnimationSpeed);

        if (!formColors ||
            formColors.length === 0 ||
            !formAnimationSpeed ||
            isNaN(formAnimationSpeedAsNum) ||
            formAnimationSpeedAsNum <= 0) 
        {
            alert("Invalid input!");
            return;
        }
        const newState: LightsState = {
            colors: formColors.split(','),
            animation: formAnimation,
            animationSpeed: formAnimationSpeedAsNum            
        };
        handleSetState(newState);
    };

    useEffect(handleGetState, []);

    const ColorsDisplay = () => {
        if (!colorsState || !colorsState.length){
            return (<div>No colors are set.</div>);
        }

        return (
            <table style={{margin: '0 auto'}}>
                <tbody>
                    {colorsState.map(c => (
                        <tr key={c}  style={{border: `1px solid #${c}`}}>
                            <td style={{backgroundColor: `#${c}`, width: '25px'}}>
                                {' '}
                            </td>
                            <td>
                                {c.toUpperCase()}
                            </td>
                        </tr>))}
                </tbody>
            </table>
        );
    };

    const translateAnimationEnum = (value: number | undefined) => {
        switch (value) {
            case Animation.Static:
                return 'Static';
            case Animation.Rotate:
                return 'Rotate';
            case Animation.RotateWithWhite:
                return 'Rotate w/ White Alternate';
            default:
                return value || 'N/A';
        }
    }

    const AnimationDisplay = () => {
        return (<>{translateAnimationEnum(animationState)}</>);
    }

    const AnimationSpeedDisplay = () => {
        return (<>
            {animationSpeedState
                ? `${animationSpeedState}x`
                : 'N/A'}
        </>);
    }

    return (
        <div className="container">
            <h1 className="text-center">MyKy Christmas Smart Control - Christmas Lights</h1>

            <div className="container">
                <div className="row mt-4">
                    <h2>Current State</h2>
                </div>
                <div className="row text-center">
                    <div className="col-sm">
                        <h5>Colors:</h5> <ColorsDisplay />
                    </div>
                    <div className="col-sm">
                        <h5>Animation:</h5> <AnimationDisplay />
                    </div>
                    <div className="col-sm">
                        <h5>Animation speed:</h5> <AnimationSpeedDisplay />
                    </div>
                </div>
                <div className="row mt-4">
                    <h2>Update Lights</h2>
                </div>
                <div className="row">
                    <div className="col-sm-4" style={{borderRight: '1px solid black'}}>
                        <h5>Presets</h5>
                        <button
                            type="button"
                            className="btn btn-secondary btn-large"
                            onClick={() => handleSetState({
                                colors: ['ff0000'],
                                animation: Animation.Static,
                                animationSpeed: 1
                            })}
                        >
                            Static Red
                        </button>
                        <br/>
                        <button
                            type="button"
                            className="btn btn-secondary btn-large"
                            onClick={() => handleSetState({
                                colors: ['00ff00'],
                                animation: Animation.Static,
                                animationSpeed: 1
                            })}
                        >
                            Static Green
                        </button>
                        <br/>
                        <button
                            type="button"
                            className="btn btn-secondary btn-large"
                            onClick={() => handleSetState({
                                colors: ['ff0000','00ff00'],
                                animation: Animation.Static,
                                animationSpeed: 1})}
                        >
                            Static Red and Green
                        </button>
                        <br/>
                        <button
                            type="button"
                            className="btn btn-secondary btn-large"
                            onClick={() => handleSetState({
                                colors: ['ff0000','00ff00'],
                                animation: Animation.Rotate,
                                animationSpeed: 0.5})}
                        >
                            Rotate Red and Green
                        </button>
                        <br/>
                        <button
                            type="button"
                            className="btn btn-secondary btn-large"
                            onClick={() => handleSetState({
                                colors: ['ff0000','00ff00','0000ff'],
                                animation: Animation.Rotate,
                                animationSpeed: 1
                            })}
                        >
                            Rotate RGB
                        </button>
                        <br/>
                        <button
                            type="button"
                            className="btn btn-secondary btn-large"
                            onClick={() => handleSetState({
                                colors: ['ff0000','00ff00','0000ff'],
                                animation: Animation.Rotate,
                                animationSpeed: 0.5
                            })}
                        >
                            Slow Rotate RBG
                        </button>
                        <br/>
                        <button
                            type="button"
                            className="btn btn-secondary btn-large"
                            onClick={() => handleSetState({
                                colors: ['ff0000','00ff00','0000ff'],
                                animation: Animation.RotateWithWhite,
                                animationSpeed: 2})}
                        >
                            Fast Rotate RGB w/ White
                        </button>
                    </div>
                    <div className="col-sm-8">
                        <h5>Manual</h5>
                        <form>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Colors</label>
                                <div className="col-sm-10">
                                    <input
                                        type='text'
                                        className="form-control"
                                        value={formColors}
                                        onChange={e => setFormColors(e.target.value)}
                                    />
                                    <small id="emailHelp" className="form-text text-muted">Comma separated list</small>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Animation</label>
                                <div className="col-sm-10">
                                    {Object.keys(Animation)
                                        .map(a => Number(a))
                                        .filter(a => !isNaN(a))
                                        .map(a => (
                                            <div key={a} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    value={a}
                                                    checked={formAnimation === a}
                                                    onChange={() => setFormAnimation(a)} />
                                                <label className="form-check-label">
                                                    {translateAnimationEnum(a)}
                                                </label>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Animation Speed</label>
                                <div className="col-sm-10">
                                    <input
                                        type='text'
                                        className="form-control"
                                        value={formAnimationSpeed}
                                        onChange={e => setFormAnimationSpeed(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-10 offset-sm-2">
                                    <button className="btn btn-primary" onClick={handleUpdateLights}>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    </div>
                <div className="row mt-4">
                    <h2>Admin</h2>
                </div>
                <div className="row">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={showPersistenceControls}
                            onChange={() => setShowPersistenceControls(!showPersistenceControls)}
                        />
                        <label className="form-check-label">
                            Show Persistence Controls
                        </label>
                    </div>
                </div>
                <div className="row">
                    {showPersistenceControls && (
                        <div className="col-sm">
                            <h2>Persistence</h2>
                            <button
                                type="button"
                                className="btn btn-warning btn-large"
                                onClick={() => handleGetPersistence()}
                            >
                                Get Persistence
                            </button>
                            <button
                                type="button"
                                className="btn btn-warning btn-large"
                                onClick={() => handleDeletePersistence()}
                            >
                                Delete Persistence
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <img src="https://i.imgur.com/z9HYCt0.jpg" className="img-fluid" alt="Christmas Doggy" />
        </div>
    );
}

export default App;
