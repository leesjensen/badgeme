const app = require('./service');

const port = process.argv[2] || 3000;
app.listen(port, () => {
  console.log(`🏅 BadgeMe is running on port ${port}`);
});
