// "use client";

// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from "@mui/material";
// import clsx from "clsx";

// export type Column<T> = {
//   key: keyof T;
//   label: string;
//   className?: string;
//   render?: (row: T) => React.ReactNode;
// };

// type Props<T extends { id: string | number }> = {
//   columns: Column<T>[];
//   data: T[];
// };

// function renderValue(value: unknown): React.ReactNode {
//   if (
//     typeof value === "string" ||
//     typeof value === "number" ||
//     typeof value === "boolean"
//   ) {
//     return value;
//   }

//   return value ? String(value) : null;
// }

// export default function GenericTable<T extends { id: string | number }>({
//   columns,
//   data,
// }: Props<T>) {
//   return (
//     <div className="overflow-x-auto md:overflow-x-visible">
//       <Table className="min-w-[600px] w-full">
//         <TableHead>
//           <TableRow>
//             {columns.map((col) => (
//               <TableCell
//                 key={String(col.key)}
//                 className={clsx(col.className)}
//                 sx={{ fontWeight: 500, fontSize: 16, color: "#363636" }}
//               >
//                 {col.label}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {data.map((row) => (
//             <TableRow key={row.id}>
//               {columns.map((col) => (
//                 <TableCell
//                   key={String(col.key)}
//                   sx={{ color: "#606060", fontSize: 14 }}
//                 >
//                   {col.render ? col.render(row) : renderValue(row[col.key])}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// "use client";

// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
// } from "@mui/material";
// import clsx from "clsx";

// export type Column<T> = {
//   key: keyof T;
//   label: string;
//   className?: string;
//   render?: (row: T) => React.ReactNode;
// };

// type Props<T extends { id: string | number }> = {
//   columns: Column<T>[];
//   data: T[];
//   maxHeight?: number; // ✅ configurable
// };

// function renderValue(value: unknown): React.ReactNode {
//   if (
//     typeof value === "string" ||
//     typeof value === "number" ||
//     typeof value === "boolean"
//   ) {
//     return value;
//   }

//   return value ? String(value) : null;
// }

// export default function GenericTable<T extends { id: string | number }>({
//   columns,
//   data,
//   maxHeight = 420, // ✅ default scroll height
// }: Props<T>) {
//   return (
//     <TableContainer
//       sx={{
//         maxHeight,
//         overflowY: "auto",
//       }}
//       className="rounded-lg"
//     >
//       <Table stickyHeader className="min-w-[600px] w-full">
//         <TableHead>
//           <TableRow>
//             {columns.map((col) => (
//               <TableCell
//                 key={String(col.key)}
//                 className={clsx(col.className)}
//                 sx={{
//                   fontWeight: 500,
//                   fontSize: 16,
//                   color: "#363636",
//                   backgroundColor: "#fff", // ✅
//                 }}
//               >
//                 {col.label}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {data.map((row) => (
//             <TableRow key={row.id} hover>
//               {columns.map((col) => (
//                 <TableCell
//                   key={String(col.key)}
//                   sx={{ color: "#606060", fontSize: 14 }}
//                 >
//                   {col.render ? col.render(row) : renderValue(row[col.key])}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}

//           {data.length === 0 && (
//             <TableRow>
//               <TableCell
//                 colSpan={columns.length}
//                 align="center"
//                 sx={{ py: 4, color: "#9e9e9e" }}
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

"use client";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import clsx from "clsx";

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

export default function GenericTable<T extends { id: string | number }>({
  columns,
  data,
  maxHeight = 420,
}: Props<T>) {
  return (
    <TableContainer
      sx={{
        maxHeight,
        overflowY: "auto",
      }}
      className="rounded-lg"
    >
      <Table stickyHeader className="min-w-150 w-full">
        <TableHead>
          <TableRow>
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

        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} hover>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  sx={{
                    fontSize: { xs: 12, sm: 13, md: 14 },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 1, sm: 1.25 },
                    color: "#606060",
                  }}
                >
                  {col.render ? col.render(row) : renderValue(row[col.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
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
