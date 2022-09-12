import * as styles from './PizzaModal.css';
import { useSend } from 'utils/routing';
import { Events, ListItem } from 'machines/pizza.machine';
import { TEST } from 'utils/constants';

type Topping = Omit<ListItem, 'price'> & {
  price: string;
  action?: Extract<Events, { type: 'change' | 'select' }>;
};

export type Props = {
  title: string;
  text: string;
  buttons: {
    text: string;
    action: Extract<Events, { type: 'modal.confirm' | 'modal.close' }>;
  }[];
  actions: {
    close: Extract<Events, { type: 'modal.close' }>;
  };
  items: Topping[];
};

/* c8 ignore start */
const PizzaModal = ({ actions, title, text, buttons, items }: Props) => {
  const send = useSend();
  return (
    <>
      <div className={styles.background} />
      <div className={styles.modal} onClick={() => send(actions.close)}>
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          <h1>{title}</h1>
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
                &nbsp;&nbsp;<small>{item.price}</small>
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
