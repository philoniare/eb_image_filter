import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

function isValidURL(url: string) {
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    // Validate
    const url = req.query.image_url
    if(isValidURL(url)) {
      // Filter the image
      const filename = await filterImageFromURL(req.query.image_url)
      res.sendFile(filename, null, function(err) {
        if(!err) {
          // Cleanup
          deleteLocalFiles([filename])
        }
      });
    } else {
      res.status(400).send('Invalid image URL!')
    }
  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
