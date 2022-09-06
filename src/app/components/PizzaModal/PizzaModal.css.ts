import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const content = style({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  margin: 'auto',
  backgroundColor: 'rgba(0,0,0,0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  fontSize: calc.add('10px', '2vmin'),
  flexDirection: 'column',
});

export const button = style({
  // fontSize: '1.5rem',
  // padding: '.8rem',
});
