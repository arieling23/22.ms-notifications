const cors = require('cors');

module.exports = cors({
  origin: 'http://54.225.75.133:3000',
  credentials: true
});
