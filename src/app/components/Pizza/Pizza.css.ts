import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const content = style({
  backgroundColor: '#282c34',
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: calc.add('10px', '2vmin'),
  color: 'white',
  flexDirection: 'column',
});

export const button = style({
  fontSize: '1.5rem',
  padding: '.8rem',
});
