import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';


console.log(process.env) // remove this after you've confirmed it is working

const engine = new Liquid({
    extname: '.liquid'
});
  
const app = new App();
  
app
    .use(logger())
    .use('/', sirv('dist/assets'))
    .listen(8500);
  
app.get('/', (req, res) => {
    //console.log(req);
    res.send('Hello World!');
});

