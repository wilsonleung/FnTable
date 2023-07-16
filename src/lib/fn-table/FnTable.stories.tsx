import type { StoryDefault, Story } from "@ladle/react";
import FnTable, { FnColumn, FnTableProps } from "@/fn-table/FnTable";
import { ColumnHelper } from "@tanstack/react-table";
import { Person, createPeopleList } from "@/stories/util/test-data";


const data: Person[] = createPeopleList(20);

const defaultColumn: FnColumn<Person> = {
  width: 200,
  alignment: 'center',

};

const columns: FnColumn<Person>[] = [
  {
    key: 'firstName',
    header: "First Name",
  },
  {
    key: 'lastName',
    header: "Last Name",
  },
  {
    key: 'age',
    header: "Age",
    alignment: 'right'
  }
  , {
    key: 'married',
    header: "Married",
    cellRenderer: (getValue) => getValue() ? <span style={{ color: 'red' }}>Y</span> : <span style={{ color: 'green' }}>N</span>
  }

]


const columnsFn = (column: ColumnHelper<Person>) => {
  return [
    column.accessor('firstName', {
      header: 'First Name',
      size: 200,
    }),
    column.accessor('lastName', {
      header: () => <i style={{ color: 'red' }}>Last Name</i>
    }),
    column.accessor(row => row.age, {
      header: 'Age',
      meta: { align: 'right' }
    }),
    column.accessor('married', {
      header: 'Married',
      cell: info => info.getValue() ? 'Y' : 'N',
      size: 80,
      meta: { align: 'middle' }
    }),
    column.display({
      header: 'Full Name',
      cell: info => `${info.row.getValue('firstName')} ${info.row.getValue('lastName')}`
    }),

  ]
}

export const table: Story<FnTableProps<Person>> = (args) => {
  return <FnTable {...args} />
}

table.storyName = "Default";
table.args = {
  data,
  columnsFn,
  defaultColumn,
  columns
}

export default {
  title: "Table",
} satisfies StoryDefault;
