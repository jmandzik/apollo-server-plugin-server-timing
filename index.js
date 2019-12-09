const http = require("http");

function pathToKey(tracingResolverPath) {
  return tracingResolverPath.join(".");
}

function durationInMS(highPrecisionTiming) {
  return (highPrecisionTiming / 1000000).toFixed(2);
}

module.exports = {
  requestDidStart() {
    return {
      willSendResponse(requestContext) {
        // No-op if there is no tracing extension
        if (
          !requestContext ||
          !requestContext.response ||
          !requestContext.response.extensions ||
          !requestContext.response.extensions.tracing
        ) {
          // Should we warn here that the plugin's enable but without the required tracing enabled?
          return;
        }

        try {
          const resolvers =
            requestContext.response.extensions.tracing.execution.resolvers;

          const results = resolvers.reduce(
            (accumulator, resolver) =>
              accumulator.set(
                pathToKey(resolver.path),
                durationInMS(resolver.duration)
              ),
            new Map()
          );
          if (results.size === 0) {
            return;
          }
          const timings = [];
          for (let [desc, dur] of results) {
            timings.push(`${desc};dur=${dur}`);
          }

          // As you approach 8kb, default max header lengths start to be a problem under nodejs defaults
          // Truncating to 1kb less than current max as a precaution
          const maxLength = http.maxHeaderSize - 1024;
          if (maxLength <= 0) {
            return;
          }
          let serverTiming = timings.join(",").substring(0, maxLength);

          requestContext.response.http.headers.set(
            "Server-Timing",
            serverTiming
          );
        } catch (error) {
          // Never want potential issues in the plugin to stop requests from proceeding
          console.warn(error.message);
        }
      }
    };
  }
};
