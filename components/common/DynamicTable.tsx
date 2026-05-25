"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Checkbox,
} from "@mui/material";
import clsx from "clsx";
import React from "react";

export type Column<T> = {
  key: keyof T;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T extends { id: string | number }> = {
  columns: Column<T>[];
  data: T[];
  maxHeight?: number;
  onRowClick?: (row: T) => void;

  /** selection */
  showCheckBoxes?: boolean;
  // selectedIds?: (string | number)[];
  onSelectAll?: () => void;
  // // onSelectionChange?: (ids: (string | number)[]) => void;
  // onSelectionChange?: (ids: any[]) => void;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
};

function renderValue(value: unknown): React.ReactNode {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return value ? String(value) : null;
}

// export default function GenericTable<T extends { id: string | number }>({
//   columns,
//   data,
//   maxHeight = 420,
//   onRowClick,
//   showCheckBoxes = false,
//   selectedIds = [],
//   onSelectAll,
//   onSelectRow,
// }: Props<T>) {
//   const allSelected = data.length > 0 && selectedIds.length === data.length;
//   const someSelected =
//     selectedIds.length > 0 && selectedIds.length < data.length;

//   return (
//     <TableContainer
//       sx={{ maxHeight, overflowY: "auto" }}
//       className="rounded-lg bg-white shadow-sm border border-gray-200"
//     >
//       <Table stickyHeader className="min-w-150 w-full">
//         {/* ---------- HEADER ---------- */}
//         <TableHead>
//           <TableRow>
//             {showCheckBoxes && (
//               <TableCell padding="checkbox">
//                 <Checkbox
//                   checked={allSelected}
//                   indeterminate={someSelected}
//                   onChange={onSelectAll}
//                 />
//               </TableCell>
//             )}

//             {columns.map((col) => (
//               <TableCell
//                 key={String(col.key)}
//                 className={clsx(col.className)}
//                 sx={{
//                   fontWeight: 500,
//                   fontSize: { xs: 13, sm: 14, md: 16 },
//                   px: { xs: 1.5, sm: 2 },
//                   py: { xs: 1, sm: 1.5 },
//                   color: "#363636",
//                   backgroundColor: "#fff",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {col.label}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>

//         {/* ---------- BODY ---------- */}
//         <TableBody>
//           {data.map((row) => {
//             const isSelected = selectedIds.includes(row.id);

//             return (
//               <TableRow
//                 key={row.id}
//                 className="group"
//                 hover
//                 onClick={onRowClick ? () => onRowClick(row) : undefined}
//                 sx={{
//                   cursor: onRowClick ? "pointer" : "default",
//                   backgroundColor: isSelected ? "#F0F6FF" : "inherit",
//                 }}
//               >
//                 {/* row checkbox */}
//                 {showCheckBoxes && (
//                   <TableCell padding="checkbox">
//                     <Checkbox
//                       checked={isSelected}
//                       onClick={(e) => e.stopPropagation()}
//                       onChange={() => onSelectRow?.(row.id)}
//                     />
//                   </TableCell>
//                 )}

//                 {columns.map((col) => (
//                   <TableCell
//                     key={String(col.key)}
//                     sx={{
//                       fontSize: { xs: 12, sm: 13, md: 14 },
//                       px: { xs: 1.5, sm: 2 },
//                       py: { xs: 1, sm: 1.25 },
//                       color: "#606060",
//                     }}
//                   >
//                     {col.render ? col.render(row) : renderValue(row[col.key])}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             );
//           })}

//           {data.length === 0 && (
//             <TableRow>
//               <TableCell
//                 colSpan={columns.length + 1}
//                 align="center"
//                 sx={{ py: 4, fontSize: { xs: 13, sm: 14 }, color: "#9e9e9e" }}
//               >
//                 No data found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

export default function GenericTable<T extends { id: string | number }>({
  columns,
  data,
  maxHeight = 420,
  onRowClick,
  showCheckBoxes = false,
  // selectedIds = [],
  onSelectAll,
  selectedRows = [],
  onSelectionChange,
}: Props<T>) {
  /* -------------------------------------------------- */
  /* ✅ Normalize + Optimize Selection Using Set       */
  /* -------------------------------------------------- */

  // const selectedSet = React.useMemo(
  //   () => new Set(selectedIds.map((id) => String(id))),
  //   [selectedIds],
  // );

  const selectedSet = React.useMemo(
    () => new Set(selectedRows.map((row) => String(row.id))),
    [selectedRows],
  );

  // const allSelected = data.length > 0 && selectedSet.size === data.length;
  const allSelected =
    data.length > 0 && data.every((row) => selectedSet.has(String(row.id)));

  const someSelected = selectedSet.size > 0 && selectedSet.size < data.length;

  /* -------------------------------------------------- */
  /* ✅ Internal Selection Handlers (Optimized)        */
  /* -------------------------------------------------- */

  const handleSelectAll = () => {
    if (onSelectionChange) {
      if (allSelected) {
        onSelectionChange([]);
      } else {
        // onSelectionChange(data.map((row) => row.id));
        onSelectionChange(data);
      }
      return;
    }
    // fallback (backward compatibility)
    onSelectAll?.();
  };

  const handleSelectRow = (row: T) => {
    if (!onSelectionChange) {
      return;
    }

    const idStr = String(row.id);

    if (selectedSet.has(idStr)) {
      onSelectionChange(
        selectedRows.filter((item) => String(item.id) !== idStr),
      );
    } else {
      onSelectionChange([...selectedRows, row]);
    }
  };

  return (
    <TableContainer
      sx={{ maxHeight, overflowY: "auto" }}
      className="rounded-[20px] bg-white border border-[#DDDDDD]"
    >
      <Table stickyHeader className="min-w-150 w-full">
        {/* ---------- HEADER ---------- */}
        <TableHead>
          <TableRow>
            {showCheckBoxes && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
            )}

            {columns.map((col) => (
              <TableCell
                key={String(col.key)}
                className={clsx(col.className)}
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: 13, sm: 14, md: 16 },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 1, sm: 1.5 },
                  color: "#363636",
                  backgroundColor: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* ---------- BODY ---------- */}
        <TableBody>
          {data.map((row) => {
            const isSelected = selectedSet.has(String(row.id));

            return (
              <TableRow
                key={row.id}
                className="group"
                hover
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  backgroundColor: isSelected ? "#F0F6FF" : "inherit",
                }}
              >
                {showCheckBoxes && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      // onChange={() => handleSelectRow(row.id)}
                      onChange={() => handleSelectRow(row)}
                    />
                  </TableCell>
                )}

                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    sx={{
                      fontSize: { xs: 12, sm: 13, md: 14 },
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 1, sm: 1.25 },
                      color: "#606060",
                      opacity: col.render ? 1 : 0.7,
                    }}
                  >
                    {col.render ? col.render(row) : renderValue(row[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}

          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (showCheckBoxes ? 1 : 0)}
                align="center"
                sx={{
                  py: 4,
                  fontSize: { xs: 13, sm: 14 },
                  color: "#9e9e9e",
                }}
              >
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
