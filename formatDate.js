function formatDate(date) {
  const timestamp = new Date(Number(date));
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("es-CO", options).format(
    timestamp
  );

  return formattedDate;
}


module.exports = formatDate;