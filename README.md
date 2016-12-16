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
# Launch Functions API
docker run --rm -it --name functions --privileged -v $PWD/data:/app/data -p 8080:8080 iron/functions


# Launch FunctionsUI (use `docker-machine ip` instead of localhost if needed - for mac only)
API_URL=http://localhost:8080 npm start

# Launch launch automatic asset recompilation:
webpack --watch
```

