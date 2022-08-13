import { Fragment } from 'react';
import { Link } from 'wouter';
import logo from '../../../img/logo.svg';
import * as styles from './Header.css';
import Button from 'elements/Button/Button';
import { useSend } from 'utils/routing';
import { renderTags, Tags } from 'utils';
import type { Path } from 'routes/routes';
import type { Event } from 'routes/machine';

export type Props = {
  title: string;
  body?: Tags;
  buttons: { id: string; action?: Event; text: string }[];
  links: { id: string; to: Path; text: string }[];
};

/* c8 ignore start */
const Header = ({ body, title, buttons, links }: Props) => {
  const send = useSend();
  return (
    <header className={styles.header}>
      <img src={logo} className={styles.logo} alt="logo" />
      <p>{title}</p>
      {buttons.map((button) => (
        <div style={{ paddingBottom: '.5em' }} key={button.id}>
          <Button
            {...(button.action && {
              onClick: () => {
                button.action && send(button.action);
              },
            })}
          >
            {button.text}
          </Button>
        </div>
      ))}
      {body && <p>{renderTags(body)}</p>}
      <p>
        {links.map((link, i) => (
          <Fragment key={link.id}>
            <Link className={styles.link} to={link.to}>
              {link.text}
            </Link>
            {i < links.length - 1 ? ' | ' : ''}
          </Fragment>
        ))}
      </p>
    </header>
  );
};
/* c8 ignore stop */

export default Header;
