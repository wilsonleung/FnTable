export interface FnTableProps {
  title: string
}

function FnTable({ title, children }: React.PropsWithChildren<FnTableProps>) {
  return <div>
    <h1>{title}</h1>
    {children}
  </div>
}

export default FnTable;
