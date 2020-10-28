require('dotenv-flow').config();

const PORT = process.env.HTTP_PORT;

const Koa            = require('koa');
const bodyParser     = require('koa-body');
const Router         = require('koa-router');
const router         = new Router();
const apiRouter      = new Router({ prefix: '/api' });
const app            = new Koa();
const mongoose       = require('mongoose');
const { authMiddleware } = require('middlewares')

mongoose.connect(process.env.MONGODB_CONNECTION, {
  useCreateIndex:     true,
  useNewUrlParser:    true,
  useUnifiedTopology: true,
  useFindAndModify:   false,
});

app.use(authMiddleware);
app.use(bodyParser({
  multipart: true,
}));

const healthCheck = (ctx) => {
  ctx.body = { msg: 'ping' };
};

router.get('/health', healthCheck);

require('controllers')(apiRouter);
router.use(apiRouter.routes());
app.use(router.routes());
app.use(router.allowedMethods());

const handleError = (err, ctx) => {
  console.log('err: ', err);
  if (ctx == null) {
    console.error('Error: ', 'Unhandled exception occured - ' + JSON.stringify(err));
  }
};

app.on('error', handleError);

app.listen(PORT || 4000, () => {
  console.log(`API server started on http://localhost:${PORT}/`);
});

module.exports = app;