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
  actions: {
    close: {
      type: 'modal.close';
    };
  };
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
};

/* c8 ignore start */
const PizzaModal = ({ actions, text, buttons, items }: Props) => {
  const send = useSend();
  return (
    <>
      <div className={styles.background} />
      <div className={styles.modal} onClick={() => send(actions.close)}>
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          <h1>Pizza toppings</h1>
          <small>{text}</small>
          <br />
          <br />
          <ul className={styles.ul}>
            {items.map((item) => (
              <li key={item.id} className={styles.li}>
                <input
                  checked={item.checked}
                  onChange={() => {
                    item.action && send(item.action);
                  }}
                  // RTL does not support onChange
                  {...(TEST && {
                    onClick: () => item.action && send(item.action),
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
    </>
  );
};
/* c8 ignore stop */

export default PizzaModal;
