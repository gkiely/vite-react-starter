import logo from 'img/logo.svg';
import * as styles from './Header.css';
import Button from 'elements/Button/Button';
import { Action, useSend } from 'utils/routing';
import { renderTags, Tags } from 'utils';
import { Fragment } from 'react';
import type { CountActions, PostActions } from 'routes/routes';

export type Props = {
  title: string;
  body: Tags;
  buttons: { id: string; action?: Action<CountActions | PostActions>; text: string }[];
  links: { id: string; to: string; text: string }[];
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
              onClick: () => button.action && send(button.action),
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
