# UI for [Titan](https://github.com/iron-io/titan)

# Usage






# Development

Install dependencies:
```
npm install && npm install -g webpack
```


Start web server:
```
PORT=4000 API_URL=http://....../ npm start
```
* `PORT` - optional, 4000 by default
* `API_URL` - required, Titan API url, e.g. `http://localhost:8080`.


Launch automatic asset recompilation:
```
webpack --watch
```

Example:
```
# Launch Titan API
docker run --rm -it -p 8080:8080 iron/titan-api`

# Launch TitanUI (`docker-machine ip` part for mac only, for other cases use `localhost` instead)
API_URL=http://`docker-machine ip`:8080 npm start

# Launch launch automatic asset recompilation:
webpack --watch
```

Start jobs:
```
 curl -X POST -H "Content-Type: application/json" -d '{
    "jobs": [{
    "image": "treeder/hello:1.0.0",
    "payload": "{\"name\": \"Johnny Utah\"}"
  }]
}' "http://`docker-machine ip`:8080/v1/groups/foobar/jobs"|jj
```

