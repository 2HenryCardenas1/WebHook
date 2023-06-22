const express = require("express"); // Express web server framework
const axios = require("axios"); // Axios for making HTTP requests
const fs = require("fs"); // For reading the file
const formatDate = require("./formatDate");

const app = express(); // Initialize the express app
const PORT = process.env.PORT || 3000;
const LOG_FILE = "webhook.log";


app.use(express.json()); // For parsing application/json

app.post("/webhook", (req, res) => {
  const URL = req.body.endPoint;
  axios
    .get(URL)
    .then((response) => {
      const dataLog = {
        Date: formatDate(response.data.TimestampMs),
        TypeEvent: response.data.EventType,
        ConversationSid: response.data.TaskAttributes.conversationSid,
        TaskAttributes: response.data.TaskAttributes.data,
      };

      const log = JSON.stringify(dataLog) + "\n";
      fs.appendFile(LOG_FILE, log, (err) => {
        if (err) throw err;
      });

      res.status(200).send("Ok");
    })
    .catch((error) => {
      switch (error.response.status) {
        case 400:
          console.error("Error 400: Bad Request");
          res.status(400).send("Error 400: Bad Request");
          break;
        case 401:
          console.error("Error 401: Unauthorized");
          res.status(401).send("Error 401: Unauthorized");
          break;
        case 500:
          console.error("Error 500: Internal Server Error");
          res.status(500).send("Error 500: Internal Server Error");
          break;
        default:
          res.status(500).send("Error al obtener los datos del archivo JSON");
      }
    });
});

app.get("/webhook.log", (req, res) => {
  res.send(fs.readFileSync(LOG_FILE, "utf8"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
