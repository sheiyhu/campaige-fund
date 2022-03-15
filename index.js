const express = require("express");
const calculate = require("./controller.js");

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.json());

app.get("/candidate/:candidateName", calculate.calculateAggregation);

app.get("/", (req, res, next) => {
  res.status(200).json({
    state: "working",
  });
});

app.get('/candidate/', (req, res, next) => {
  res.status(404).json({
    status: 'Error',
    message: 'Invalid request, No candidate name was provided'
  })
})

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

module.exports = server;
