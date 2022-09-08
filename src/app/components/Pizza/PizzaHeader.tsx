import type { Path } from 'routes/paths';
import { useSend } from 'utils/routing';
import type { Event } from 'machines/machines';
import * as styles from './Pizza.css';
import { Fragment } from 'react';
import { Link } from 'wouter';

export type Props = {
  button: {
    text: string;
    action: Event;
  };
  links?: { id: string; to: Path; text: string }[];
  text: string;
};

/* c8 ignore start */
const Pizza = ({ button, links, text }: Props) => {
  const send = useSend();
  return (
    <div className={styles.content}>
      <p>{text}</p>
      <button className={styles.button} onClick={() => send(button.action)}>
        {button.text}
      </button>
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
    </div>
  );
};
/* c8 ignore stop */

export default Pizza;
