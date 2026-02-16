type NoDataProps = {
  message?: string;
  className?: string;
};

const NoTableData = ({
  message = "No data found",
  className = "",
}: NoDataProps) => {
  return (
    <div
      className={`bg-white shadow-sm rounded-lg w-full flex items-center justify-center text-gray-500 text-sm ${className}`}
      style={{ minHeight: "200px" }}
    >
      {message}
    </div>
  );
};

export default NoTableData;
