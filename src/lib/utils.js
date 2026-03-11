export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


export const formatMessageDate = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return "Hari ini";
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Kemarin";
  } else {
    return messageDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
};
