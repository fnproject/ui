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

`fnApiOptions` is used to specify options that are passed to the [request](https://www.npmjs.com/package/request) function when pooling the Fn server for statistics.

These can be configured by changing `config/default.json` or setting `NODE_CONFIG`. For example, to set `maxSockets` to `1`:
```
NODE_CONFIG='{"fnApiOptions": {"pool": {"maxSockets": 1}}}' PORT=4000 FN_API_URL=http://localhost:8080 npm start
```