# Configuration options

## Configuration using environment variables

* `PORT` - port to run UI on. Optional, 4000 by default
* `FN_API_URL` - Functions API URL. Required
* `NODE_CONFIG` - node-config configuration options

## Configuration using node-config

Some configuration options are specified using [node-config](https://www.npmjs.com/package/config). 
These are read from a configuration file  `config/default.json` and may be configured by changing that file,
by specifying a different configuration file (see the [node-config](https://www.npmjs.com/package/config) documentation for details)
or by setting the `NODE_CONFIG` environment variable.

Here is `config/default.json`:
```
{
  "fnApiOptions": {
    "pool": {
      "maxSockets": "Infinity"
    }
  }
}
```

The following configuration option may be specified this way:

`fnApiOptions` is used to specify options that are passed to the [request](https://www.npmjs.com/package/request) function when polling the Fn server for statistics. You can specify any valid request option (not just `maxSockets`). [Here is a complete list](https://www.npmjs.com/package/request#requestoptions-callback)

Here is an example which uses the `NODE_CONFIG` environment variable to set the `pool` option's `maxSockets` property to `1` prior to starting the UI server:
```
NODE_CONFIG='{"fnApiOptions": {"pool": {"maxSockets": 1}}}' PORT=4000 FN_API_URL=http://localhost:8080 npm start
```