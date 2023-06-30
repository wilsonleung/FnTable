import type { StoryDefault, Story } from "@ladle/react";
import FnTable, { FnTableProps } from "@/fn-table/FnTable";
import { ColumnHelper } from "@tanstack/react-table";

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  married: boolean;
}

const data: Person[] = [
  {
    firstName: 'He',
    lastName: 'Man',
    age: 20,
    married: false
  },
  {
    firstName: 'She',
    lastName: 'Ra',
    age: 19,
    married: true
  }
];

const columnsFn = (column: ColumnHelper<Person>) => {
  return [
    column.accessor('firstName', {
      header: 'First Name'
    }),
    column.accessor('lastName', {
      header: () => <i style={{ color: 'red' }}>Last Name</i>
    }),
    column.accessor(row => row.age, {
      header: 'Age'
    }),
    column.accessor('married', {
      header: 'Married',
      cell: info => info.renderValue() ? 'Y' : 'N'
    }),

  ]
}

export const table: Story<FnTableProps<Person>> = (args) => {
  return <FnTable {...args} />
}

table.storyName = "Default";
table.args = {
  data,
  columnsFn
}

export default {
  title: "Table",
} satisfies StoryDefault;
