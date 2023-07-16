import { HTMLProps, useEffect, useRef } from "react";
import './MultiSelectCellRenderer.css';

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

  return <input ref={ref} className={`${className} fn-cell-multi-select`} type="checkbox" {...rest} />
}

export default MultiSelectCellRenderer;
