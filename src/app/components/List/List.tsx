/* c8 ignore start */
import { Component, Element } from 'utils/routing';

export type ListProps = Component<{
  items: Required<Element<{ title: string }>>[];
  error?: string;
}>;

const List = ({ items, error }: ListProps) => {
  if (error) {
    return <h1>{error}</h1>;
  }
  return (
    <div>
      {items.map((item, i) => (
        <h1 key={`List-${i}`}>{item.title}</h1>
      ))}
    </div>
  );
};

export default List;

/* c8 ignore stop */
