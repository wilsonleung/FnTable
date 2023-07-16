import { HTMLProps } from "react";
import './SelectCellRenderer.css';

function SingleSelectCellRenderer({className = "", ...rest }: React.PropsWithChildren<HTMLProps<HTMLInputElement>>) {
  return <input type="radio" className={`${className} fn-cell-select`} {...rest}/>
}

export default SingleSelectCellRenderer;
