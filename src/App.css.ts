import { keyframes, style } from '@vanilla-extract/css';

export const rotate = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
});

export const app = style({
  textAlign: 'center',
});

export const logo = style({
  height: '40vmin',
  pointerEvents: 'none',
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      animation: `${rotate} infinite 20s linear`,
    },
  },
});

export const header = style({
  backgroundColor: '#282c34',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'calc(10px + 2vmin)',
  color: 'white',
});

export const link = style({
  color: '#61dafb',
});

// @media (prefers-reduced-motion: no-preference) {
//   .App-logo {
//     animation: App-logo-spin infinite 20s linear;
//   }
// }
