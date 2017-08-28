# UI for [Fn](https://github.com/fnproject/fn)

## Usage

Just run the container.
`API_URL` is Fn API URL

```
docker run --rm -it --link functions:api -p 4000:4000 -e "API_URL=http://api:8080" fnproject/ui
```

## Screenshots

![ScreenShot routes](https://raw.githubusercontent.com/fnproject/fn-ui/master/docs/screenshots/routes.png)
![ScreenShot run command](https://raw.githubusercontent.com/fnproject/fn-ui/master/docs/screenshots/run.png)

## Development

### 1) Install dependencies
```
npm install && npm install -g webpack
```

### 2) Start Functions API (see [Fn on Github](http://github.com/fnproject/fn))
```
fn start
```

### 3) Start web server:
```
PORT=4000 API_URL=http://localhost:8080 npm start
```

* `PORT` - port to run UI on. Optional, 4000 by default
* `API_URL` - Functions API URL. Required

### 4) Launch automatic asset recompilation:
```
webpack --watch
```

### 5) View in browser

[http://localhost:4000/](http://localhost:4000/)


