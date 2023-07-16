import { HTMLProps, useEffect, useRef } from "react";
import './SelectCellRenderer.css';

export interface MultiSelectCellRendererProps extends HTMLProps<HTMLInputElement> {
  indeterminate?: boolean
}

function MultiSelectCellRenderer({ indeterminate = false, className = '', ...rest }: React.PropsWithChildren<MultiSelectCellRendererProps>) {

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {

    if (ref.current && typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return <input ref={ref} className={`${className} fn-cell-select`} type="checkbox" {...rest} />
}

export default MultiSelectCellRenderer;
