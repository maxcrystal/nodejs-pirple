# Homework Assignment #6

"Hello World" API from the [first homework assignment](https://github.com/maxcrystal/nodejs_mc_hw1) refactored to run across all the cores of the machine (using the cluster module).


### App logs:

```
Master 21167 has started
Worker 21168 has started
Worker 21169 has started
Worker 21171 has started
Worker 21170 has started
The server is listening on port 3000
The server is listening on port 3000
The server is listening on port 3001
The server is listening on port 3001
The server is listening on port 3000
The server is listening on port 3001
The server is listening on port 3000
The server is listening on port 3001

Worker 21169 has responded for request "POST /hello" with status code 200:
'{"hello":"This is home work #6","payload":"","query":{"name":"max"},"worker":21169}'

Worker 21170 has responded for request "POST /not/found" with status code 404:
'{}'

Worker 21169 has responded for request "GET /hello" with status code 406:
'{}'
```