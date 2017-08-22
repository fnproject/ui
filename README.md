# UI for [Fn](https://github.com/fnproject/fn)

# Usage

Run the UI server using Docker:

```
docker run --rm -it --link functions:api -p 4000:4000 -e "API_URL=http://api:8080" iron/functions-ui
```

`API_URL` is the Fn API URL

# Screenshots

![ScreenShot routes](https://raw.githubusercontent.com/iron-io/functions-ui/master/docs/screenshots/routes.png)
![ScreenShot run command](https://raw.githubusercontent.com/iron-io/functions-ui/master/docs/screenshots/run.png)

# Development

(These instructions are for Ubuntu and so use the `apt` package manager)

1) Install node 

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```
 
2) Install npm, the Javascript package manager

```
sudo apt install npm
```

3) Install yarn 

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

4) Install webpack globally  

```
sudo npm install -g webpack
```

5) Install *locally* the dependencies of the current package (as defined by `./package.json`) (locally means in `./node_modules`):

```
sudo npm install  

```

6) Install `chart.js` and `vue-chartjs`


```
sudo yarn install
sudo yarn add vue-chartjs -Snode
sudo yarn add chart.js
```

7) Run `webpack`

```
webpack
```

8) Start the Fn server and API

* See the [fn instructions](https://github.com/fnproject/ui/blob/master/README.md) for how to do this, either using docker or directly from source.

9) Start the UI server

```
PORT=4000 API_URL=http://localhost:8080 npm start
```

* `PORT` - port to run UI on. Optional, 4000 by default
* `API_URL` - Functions API URL. Required

10) Launch automatic asset recompilation (if required)

```
webpack --watch
```

11) Open [http://localhost:4000/](http://localhost:4000/) in browser

