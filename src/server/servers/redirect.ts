import restify from 'restify';

const redirect_server = restify.createServer();

redirect_server.get('**', (request, reply, next) => {
  reply.redirect(301, 'https://' + request.headers['host'] + request.url, next);
});

export default redirect_server;
