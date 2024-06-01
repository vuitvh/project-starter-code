import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

const __dirname = path.resolve();

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8081;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get("/filteredimage", async (req, res) => {
  try {
    const { image_url } = req.query;
    console.log(`image_url: ${image_url}`);
    const filteredPath = await filterImageFromURL(image_url);
    res.sendFile(filteredPath, async (error) => {
      if (error) {
        res.status(404).send(`File not found, cause: ${err.message}`);
      } else {
        const tempFolder = path.join(__dirname, "/tmp/");
        const files = fs
          .readdirSync(tempFolder)
          .map((file) => path.resolve(tempFolder, file));
        await deleteLocalFiles(files);
      }
    });
  } catch (error) {
    res.status(400).send(`Bad request, cause: ${error.message}`);
  }
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (_, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
