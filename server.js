const express = require("express");
const connectionToDb = require("./config/db");
const { notFound , errorHandler } = require('./middlewares/errors')

require('dotenv').config();
const app = express();


/**__ CONNECT TO DATABASE __**/
connectionToDb();


/**__ JSON PARSER __**/
app.use(express.json());


/**__ ROUTES __**/
app.use("/api/auth", require('./routes/auth_router'));
app.use("/api/users", require('./routes/user_router'));


/**__ HANDEL ERRORS __**/
app.use(notFound);
app.use(errorHandler);


/**__ CONNECT THE BACK-END WITH DATABASE __**/
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Listening On Port ==> ${port}`);
});