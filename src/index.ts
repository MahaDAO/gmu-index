import * as express from 'express';
import * as logger from 'morgan';

import routes from './routes';

const app = express();
const cors = require('cors');
app.disable('x-powered-by');

app.use(cors())
app.use(logger('dev', { skip: () => app.get('env') === 'test' }));

// Routes
// app.use(apicache.middleware('5 minutes'));
app.use(routes);

const { PORT = 3000 } = process.env;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
