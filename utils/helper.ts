export const formatTime = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h} ${period}`;
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";

    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const month = date.toLocaleString("en-US", {
    month: "short",
  });

  const year = date.getFullYear();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${month} ${day}${getOrdinal(day)}, ${year}, ${time.toLowerCase()}`;
};
