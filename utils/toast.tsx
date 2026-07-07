import { enqueueSnackbar, closeSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const snackbarAction = (snackbarId: string | number) => (
  <IconButton
    size="small"
    onClick={() => closeSnackbar(snackbarId)}
    sx={{
      color: "#fff",
      padding: "4px",
      cursor: "pointer",
    }}
  >
    <CloseIcon fontSize="small" />
  </IconButton>
);

export const toast = {
  success: (message: string) =>
    enqueueSnackbar(message, {
      variant: "success",
      autoHideDuration: 2000,
      action: snackbarAction,
    }),

  error: (message: string) =>
    enqueueSnackbar(message, {
      variant: "error",
      autoHideDuration: 2000,
      action: snackbarAction,
    }),

  info: (message: string) =>
    enqueueSnackbar(message, {
      variant: "info",
      autoHideDuration: 2000,
      action: snackbarAction,
    }),

  warning: (message: string) =>
    enqueueSnackbar(message, {
      variant: "warning",
      autoHideDuration: 2000,
      action: snackbarAction,
    }),
};
