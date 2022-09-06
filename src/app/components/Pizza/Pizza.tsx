import { useSend } from 'utils/routing';
import { Event } from '../../machines/machines';
import * as styles from './Pizza.css';

export type Props = {
  button: {
    text: string;
    action: Event;
  };
};

/* c8 ignore start */
const Pizza = ({ button }: Props) => {
  const send = useSend();
  return (
    <div className={styles.content}>
      <button className={styles.button} onClick={() => send(button.action)}>
        {button.text}
      </button>
    </div>
  );
};
/* c8 ignore stop */

export default Pizza;
