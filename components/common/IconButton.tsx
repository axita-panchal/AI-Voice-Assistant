import { ReactNode, ButtonHTMLAttributes } from "react";

type Props = {
  children: ReactNode;
  danger?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ children, danger, ...props }: Props) {
  return (
    <button
      className={`p-1 rounded-md ${
        danger ? " text-red-600" : " text-gray-800"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
