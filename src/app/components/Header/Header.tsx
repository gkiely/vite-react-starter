import logo from 'img/logo.svg';
import * as styles from './Header.css';
import Button from 'elements/Button/Button';
import { Component, Element, useSend } from 'utils/routing';
import { renderTags, Tags } from 'utils';
import { Fragment } from 'react';

type Props = Component & {
  title: string;
  body: Tags;
  buttons: Required<Element<{ text: string }>>[];
  links: Element<{ to: string; text: string }>[];
};

const Header = ({ body, title, buttons, links }: Props) => {
  const send = useSend();
  return (
    <header className={styles.header}>
      <img src={logo} className={styles.logo} alt="logo" />
      <p>{title}</p>
      {buttons.map(button => (
        <p key={button.id}>
          <Button
            {...(button.action && {
              onClick: () => send(button.action),
            })}
          >
            {button.text}
          </Button>
        </p>
      ))}
      <p>{renderTags(body)}</p>
      <p>
        {links.map((link, i) => (
          <Fragment key={link.id}>
            <a className={styles.link} href={link.to} target="_blank" rel="noopener noreferrer">
              {link.text}
            </a>
            {i < links.length - 1 ? ' | ' : ''}
          </Fragment>
        ))}
      </p>
    </header>
  );
};

export default Header;
