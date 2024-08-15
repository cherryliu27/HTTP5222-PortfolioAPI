const express = require("express");
const path = require("path");
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || "3000";

const dbUrl = "mongodb://127.0.0.1:27017/portfolio";

const client = new MongoClient(dbUrl);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //need this line to be able to receive/parse JSON from request

//allow requests from all servers
app.use(
  cors({
    origin: "*",
  })
);

//API endpoints

/*
 * returns: an array of projects
 */
app.get("/api/projects", async (request, response) => {
  let projects = await getProjects();
  response.json(projects); //send JSON object with appropriate JSON headers
});

app.get("/api/projects/:id", async (request, response) => {
  let projectId = request.params.id;
  const project = await getProjectById(projectId);
  response.json(project);
});

app.get("/api/skills", async (request, response) => {
  let skills = await getSkills();
  response.json(skills); //send JSON object with appropriate JSON headers
  // response.send("hi!!!!");
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

//MongoDB functions
async function connection() {
  await client.connect();
  db = client.db("portfolio"); //select database
  return db;
}
/* Async function to retrieve all projects from projects collection. */
async function getProjects() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("projects").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve all skills from skills collection. */
async function getSkills() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("skills").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

async function getProjectById(id) {
  const db = await connection();
  const result = await db
    .collection("projects")
    .findOne({ _id: new ObjectId(id) });
  return result;
}
