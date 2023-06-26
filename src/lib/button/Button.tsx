import './Button.css';

export interface MyButtonProps {
  label?: string
}
export function MyButton({ label = "" }: React.PropsWithChildren<MyButtonProps>) {
  return <button className="myButton" type="button">{label}</button>
}

export default MyButton;
