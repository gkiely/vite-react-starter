import { globalStyle, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const background = style({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  margin: 'auto',
  backgroundColor: 'rgba(0,0,0,0.3)',
  zIndex: 0,
});

export const modal = style({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: calc.add('10px', '2vmin'),
});

export const content = style({
  marginTop: '-30vh',
  background: '#fff',
  padding: '3rem',
  borderRadius: 3,
  textAlign: 'left',
});

export const ul = style({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  marginBottom: calc.subtract('3rem', '6px'),
});

export const li = style({
  display: 'flex',
  marginBottom: 6,
  alignItems: 'center',
});

export const button = style({
  fontSize: '1rem',
  padding: '.3rem',
});

globalStyle(`${content} label`, {
  marginLeft: '1rem',
});

globalStyle(`${content} h1`, {
  marginBottom: 0,
});

globalStyle(`${content} input`, {
  margin: '0px 1.5px',
  transform: 'scale(1.5)',
});
