const express = require("express"); // Express web server framework
const axios = require("axios"); // Axios for making HTTP requests
const fs = require("fs"); // For reading the file
const formatDate = require("./formatDate");

const app = express(); // Initialize the express app
const PORT = process.env.PORT || 3000;
const LOG_FILE = "webhook.log";
const URL = "https://datosprueba-7893.twil.io/datosPrueba.json";

app.use(express.json()); // For parsing application/json

axios
  .get(URL)
  .then((response) => {
    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }
    return response.data;
  })
  .then((data) => {
    // Write the data to the file
    app.get("/webhook", (req, res) => {
      const dataLog = {
        Date: formatDate(data.TimestampMs),
        TypeEvent: data.EventType,
        ConversationSid: data.TaskAttributes.conversationSid,
        TaskAttributes: data.TaskAttributes.data,
      };

      const log = JSON.stringify(dataLog) + "\n";
      fs.appendFile(LOG_FILE, log, (err) => {
        if (err) throw err;
      });

      res.send("OK, view the log file");
    });
  })
  .catch((error) => {
    console.error(error);
  });

app.get("/webhook.log", (req, res) => {
  res.send(fs.readFileSync(LOG_FILE, "utf8"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
