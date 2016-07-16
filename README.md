# UI for [Titan](https://github.com/iron-io/titan)

# Usage



# Production

```
docker run --rm -it --link titan-api:api -p 4000:4000 -e "API_URL=http://api:8080" iron/titan-ui
```


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
docker run --rm -it -p 8080:8080 -e DB="bolt:///titan/data/bolt.db" -v $PWD/data:/titan/data --name titan-api iron/titan-api

# Launch Runner
docker run --rm -it --link titan-api:api -e "API_URL=http://api:8080" -v /var/run/docker.sock:/var/run/docker.sock iron/titan-runner

# Launch TitanUI (use `docker-machine ip` instead of localhost if needed - for mac only)
API_URL=http://localhost:8080 npm start

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

