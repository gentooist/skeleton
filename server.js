var application = require('./app/lib/application')
  , config = application.getConfig()
  , cluster = require('cluster') 
  , live = require('cluster-live')
  , app = require('./app')
  , log = require('logging').from(__filename)

cluster(app)
  .set("workers", config.appWorkers)
  .use(function(){
      log('Starting in ' + application.getEnvironment() + ' mode')    
    })
  .use(cluster.pidfiles())
  .use(cluster.cli())
  .use(cluster.stats({ connections: true, lightRequests: true}))
  .use(live(config.livePort, config.liveIp, { user: config.liveUsername, pass: config.livePassword }))
  .listen(config.appPort, config.appIp)