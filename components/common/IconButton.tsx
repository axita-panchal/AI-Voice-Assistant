import { ReactNode, ButtonHTMLAttributes } from "react";

type Props = {
  children: ReactNode;
  danger?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ children, danger, ...props }: Props) {
  return (
    <button
      className={`p-1 rounded-md ${
        danger ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-800"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
