import * as styles from './PizzaModal.css';
import type { Event } from 'machines/machines';
import { useSend } from 'utils/routing';
import { ListItem } from 'machines/pizza.machine';
import { TEST } from 'utils/constants';

export type Props = {
  text: string;
  buttons: {
    text: string;
    action: Event;
  }[];
  items: Array<
    ListItem & {
      action?:
        | {
            type: 'change';
            payload: string;
          }
        | {
            type: 'select';
          };
    }
  >;
  // items: {
  //   text: string;
  //   checked: boolean;
  //   // action: Event;
  //   action?: {
  //     type: string;
  //     payload: unknown;
  //   };
  //   actions?: {
  //     change: {
  //       type: string;
  //       payload: unknown;
  //     };
  //     add: {
  //       type: string;
  //       payload: unknown;
  //     };
  //     subtract: {
  //       type: string;
  //       payload: unknown;
  //     };
  //   };
  // }[];
};

/* c8 ignore start */
const PizzaModal = ({ text, buttons, items }: Props) => {
  const send = useSend();
  return (
    <div className={styles.background}>
      <div className={styles.content}>
        <h1>Pizza toppings</h1>
        <small>{text}</small>
        <br />
        <br />
        <ul className={styles.ul}>
          {items.map((item) => (
            <li key={item.id} className={styles.li}>
              <input
                checked={item.checked}
                onChange={() => item.action && send(item.action)}
                // RTL does not support onChange
                {...(TEST && {
                  onClick: () => {
                    item.action && send(item.action);
                  },
                })}
                id={item.id}
                name={item.id}
                type="checkbox"
              />
              <label htmlFor={item.id}>{item.text}</label>
              &nbsp;&nbsp;<small>${item.price}</small>
            </li>
          ))}
        </ul>
        <div>
          {buttons.map((button, i) => (
            <button
              key={i}
              className={styles.button}
              style={{ marginRight: i + 1 === buttons.length ? 0 : 6 }}
              onClick={() => send(button.action)}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
/* c8 ignore stop */

export default PizzaModal;