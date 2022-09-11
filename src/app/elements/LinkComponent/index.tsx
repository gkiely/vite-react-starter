import { forwardRef } from 'react';
import { Link, LinkProps } from 'wouter';

const LinkComponent = forwardRef((props: LinkProps, _) => <Link {...props}>{props.children}</Link>);

export default LinkComponent;
