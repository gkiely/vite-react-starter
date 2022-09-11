import { Fragment } from 'react';
import { Link } from 'wouter';
import logo from 'img/logo.svg';
import * as styles from './Header.css';
import Button from 'elements/Button/Button';
import { useSend } from 'utils/routing';
import { renderTags, Tags } from 'utils';
import type { Path } from 'routes/paths';
import type { Events } from 'machines/router.machine';

export type Props = {
  title: string;
  body?: Tags;
  buttons?: {
    id: string;
    action?: Extract<Events, { type: 'count.update' | 'post.create' | 'post.delete' }>;
    text: string;
  }[];
  links?: { id: string; to: Path; text: string }[];
  image?: boolean;
};

/* c8 ignore start */
const Header = ({ body, title, buttons, links }: Props) => {
  const send = useSend();
  return (
    <header className={styles.header}>
      <img src={logo} className={styles.logo} alt="logo" />
      <p>{title}</p>
      {buttons &&
        buttons.map((button) => (
          <div style={{ paddingBottom: '.5em' }} key={button.id}>
            <Button onClick={() => button.action && send(button.action)}>{button.text}</Button>
          </div>
        ))}
      {body && <p>{renderTags(body)}</p>}
      <p>
        {links &&
          links.map((link, i) => (
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
