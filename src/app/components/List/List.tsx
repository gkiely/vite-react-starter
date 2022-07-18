/* c8 ignore start */
import { Component, Element } from 'utils/routing';

type Props = Component & {
  items: Required<Element<{ id: string; title: string }>>[];
  error?: string;
};

const List = ({ items, error }: Props) => {
  if (error) {
    return <h1>{error}</h1>;
  }
  return (
    <div>
      {items.map((item, i) => (
        <h1 key={'List-' + item.id}>{item.title}</h1>
      ))}
    </div>
  );
};

export default List;

/* c8 ignore stop */
