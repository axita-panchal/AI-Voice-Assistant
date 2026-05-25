import Image from "next/image";
import { IconButton, Tooltip } from "@mui/material";

type TableActionButtonProps = {
  icon: string;
  alt?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  tooltip?: string;
  size?: number;
  disabled?: boolean;
};

const TableActionButton = ({
  icon,
  alt = "action-icon",
  onClick,
  tooltip,
  size = 36,
  disabled = false,
}: TableActionButtonProps) => {
  const button = (
    <IconButton
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      sx={{
        width: 40,
        height: 40,
        transition: "all 0.2s ease",
        padding: 0,
        "&.Mui-disabled": {
          opacity: 0.5,
        },
      }}
    >
      <Image
        src={icon}
        alt={alt}
        width={size}
        height={size}
        style={{
          objectFit: "contain",
        }}
      />
    </IconButton>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};

export default TableActionButton;
