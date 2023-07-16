import type { StoryDefault, Story } from "@ladle/react";
import FnTable, { FnColumn, FnTableProps } from "@/fn-table/FnTable";
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

export const table: Story<FnTableProps<Person>> = (args) => {
  return <FnTable {...args} />
}

table.storyName = "Default";
table.args = {
  data,
  defaultColumn,
  columns
}

export const sequence: Story<FnTableProps<Person>> = (args) => {
  return <FnTable {...args} />
}

sequence.storyName = "Sequence";
sequence.args = {
  data,
  defaultColumn,
  columns,
  showSequence: true
}

export const multiSelect: Story<FnTableProps<Person>> = (args) => {
  return <FnTable {...args} />
}

multiSelect.storyName = "Multi Select";
multiSelect.args = {
  data,
  defaultColumn,
  columns,
  showSequence: true,
  selectionMode: 'multiple'
}

export default {
  title: "Table",
} satisfies StoryDefault;
