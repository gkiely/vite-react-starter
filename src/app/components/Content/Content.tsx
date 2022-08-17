import { Link } from 'wouter';
import * as styles from './Content.css';
import { Button } from '@mui/material';

export type Props = {
  text: string;
  link?: {
    text: string;
    to: string;
  };
};

/* c8 ignore start */
const Content = ({ text, link }: Props) => {
  return (
    <div key="text" className={styles.content}>
      {text}
      {link && (
        <small>
          <Link to={link.to}>{link.text}</Link>
        </small>
      )}
      <br />
      {link && (
        <Button variant="contained" color="primary">
          Hello world
        </Button>
      )}
    </div>
  );
};
/* c8 ignore stop */

export default Content;
