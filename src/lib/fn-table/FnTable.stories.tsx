import type { StoryDefault, Story } from "@ladle/react";
import FnTable, { FnTableProps } from "@/fn-table/FnTable";

export default {
  title: "Table",
} satisfies StoryDefault;

export const table: Story<FnTableProps> = ({ title }) => <FnTable title={title} />
table.storyName = "Default";
table.args = {
  title: "Good Morning"
}
