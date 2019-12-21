module.exports = function (app) {
    return async function error(ctx , next) {
      try {
        await next();
      } catch (err) {
        if ('ValidationError' === err.name) err.status = 400
        if ('CastError' === err.name) err.status = 404
  
        err.status = err.status || 500
  
        ctx.err = err
        ctx.stack = err.stack && err.stack.split('\n')
        ctx.errors = err.errors
        ctx.status = err.status
  
        ctx.body = {
          success: false,
          url: ctx.url,
          method: ctx.method,
          message: ctx.err.message,
          code: ctx.err.status,
          errors: ctx.errors && Object.keys(err.errors).map(function (key) {
            return key + ': ' + err.errors[key].message
          })
        }
  
        if ('production' !== process.env.NODE_ENV && 'staging' !== process.env.NODE_ENV) {
          ctx.body.stack = ctx.stack
        }
  
        app.emit('error', err)
      }
    }
  }