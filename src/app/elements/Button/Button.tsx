/* c8 ignore start */
import { SERVER } from 'utils/constants';
import * as styles from './Button.css';

interface ButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    React.AriaAttributes {}

const Button: React.FC<ButtonProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <button className={styles.button} {...(SERVER && { type: 'submit' })} {...rest}>
      {children}
    </button>
  );
};

export default Button;
/* c8 ignore stop */
