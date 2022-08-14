import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const content = style({
  backgroundColor: '#ccc',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: calc.add('10px', '2vmin'),
  color: 'white',
  flex: 1,
});
