const appRouter = (app, fs) => {
    // variables
  const dataPath = './json-data/campaign.json';

  // READ
  app.get('/campaigns', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });
};

module.exports = appRouter;