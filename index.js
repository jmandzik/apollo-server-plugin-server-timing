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
          !requestContext.response.extensions ||
          !requestContext.response.extensions.tracing
        ) {
          return;
        }

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

        const timings = [];
        for (let [desc, dur] of results) {
          timings.push(`${desc};dur=${dur}`);
        }
        requestContext.response.http.headers.set(
          "Server-Timing",
          timings.join(",")
        );
      }
    };
  }
};
