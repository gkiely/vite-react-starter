import * as styles from './PizzaModal.css';
import type { Event } from 'machines/machines';
import { useSend } from 'utils/routing';

export type Props = {
  cancel: {
    text: string;
    action: Event;
  };
  confirm: {
    text: string;
    action: Event;
  };
};

/* c8 ignore start */
const PizzaModal = ({ cancel, confirm }: Props) => {
  const send = useSend();
  return (
    <div className={styles.content}>
      <h1>Pizza toppings</h1>
      <ul>
        <li>
          <input id="cheese" name="cheese" type="checkbox" />
          <label htmlFor="cheese">Cheese</label>
        </li>
      </ul>
      <div>
        <button className={styles.button} onClick={() => send(cancel.action)}>
          {cancel.text}
        </button>
        &nbsp;
        <button className={styles.button} onClick={() => send(confirm.action)}>
          {confirm.text}
        </button>
      </div>
    </div>
  );
};
/* c8 ignore stop */

export default PizzaModal;
