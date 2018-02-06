# Configuration options

Configuration options are set in `config/default.json`. 

```
{
  "fnApiOptions": {
    "pool": {
      "maxSockets": "Infinity"
    }
  }
}
```

`fnApiOptions` is used to specify options that are passed to the [request](https://www.npmjs.com/package/request) function when polling the Fn server for statistics. You can specify any valid request option. [Here is a complete list](https://www.npmjs.com/package/request#requestoptions-callback)

To specify an option, either modify `config/default.json` or set `NODE_CONFIG`. For example, to set the `pool` option's `maxSockets` property to `1` before starting the Ui server:
```
NODE_CONFIG='{"fnApiOptions": {"pool": {"maxSockets": 1}}}' PORT=4000 FN_API_URL=http://localhost:8080 npm start
```