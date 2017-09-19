# UI for [Fn](https://github.com/fnproject/fn)

## Usage

Start an fn server

```sh
fn start
```

Start the UI:

```sh
docker run --rm -it --link functions:api -p 4000:4000 -e "API_URL=http://api:8080" fnproject/ui
```

## Screenshots

![ScreenShot routes](https://raw.githubusercontent.com/fnproject/ui/master/docs/screenshots/routes.png)
![ScreenShot run command](https://raw.githubusercontent.com/fnproject/ui/master/docs/screenshots/run.png)

## Development

### 1) Install dependencies

```sh
npm install && npm install -g webpack
```

### 2) Start Functions API (see [Fn on Github](http://github.com/fnproject/fn))

```sh
fn start
```

### 3) Start web server

```sh
PORT=4000 API_URL=http://localhost:8080 npm start
```

* `PORT` - port to run UI on. Optional, 4000 by default
* `API_URL` - Functions API URL. Required

### 4) Launch automatic asset recompilation

```sh
webpack --watch
```

### 5) View in browser

[http://localhost:4000/](http://localhost:4000/)
