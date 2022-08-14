import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const sidebar = style({
  backgroundColor: '#282c34',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: calc.add('10px', '2vmin'),
  color: 'white',
  flex: 1,
  maxWidth: '30vw',
});
