import { Link } from 'wouter';
import { Button } from '@mui/material';
import LinkComponent from 'elements/LinkComponent';
import * as styles from './Content.css';
import { LinkProps } from 'types';

export type Props = {
  text: string;
  link?: LinkProps;
  button?: LinkProps;
};

/* c8 ignore start */
const Content = ({ text, link, button }: Props) => {
  return (
    <div className={styles.content}>
      {text}
      {link && (
        <small>
          <Link to={link.to}>{link.text}</Link>
        </small>
      )}
      <br />
      {button && (
        <Button LinkComponent={LinkComponent} href={button.to} variant="contained" color="primary">
          {button.text}
        </Button>
      )}
    </div>
  );
};
/* c8 ignore stop */

export default Content;
