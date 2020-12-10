export interface LightsState {
    colors: string[];
    animation: Animation;
    animationSpeed: number;
}

export enum Animation {
    Static = 0,
    Rotate = 1,
    RotateWithWhite = 2
}