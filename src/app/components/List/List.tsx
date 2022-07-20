/* c8 ignore start */

export type Props = {
  items: { title: string }[];
  error: string;
  loading: string;
};

const List = ({ items, error, loading }: Props) => {
  if (error) {
    return <h1>{error}</h1>;
  }
  if (loading) {
    return <h1>{loading}</h1>;
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
