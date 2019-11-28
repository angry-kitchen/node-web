title: Node Web
speaker: jigang.duan
plugins:
    - echarts

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">

# Node Web {.text-landing.text-shadow}

By 段纪刚 {.text-intro}

[:fa-github: GitPage](https://jigang-duan.github.io/2019/10/23/node-web/){.button.ghost}

<slide class="size-30 aligncenter">

#### Node.js

---

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型。<sup>[1]</sup>

<slide class="size-20 aligncenter">

Node.js作者认为

---

Web服务器的几个要点

- 事件驱动
- 非阻塞I/O

<slide class="bg-gradient-r" :class=" size-40 aligncenter" image="https://cn.bing.com/az/hprichbg/rb/WinterLynx_ZH-CN7158207296_1920x1080.jpg .dark">

#### 特性

---

- JavaScript {.animated.fadeInUp}
- 异步I/O {.animated.fadeInUp.delay-400}
- 阻塞与非阻塞 {.animated.fadeInUp.delay-800}
- 事件驱动 {.animated.fadeInUp.delay-1200}
- 单线程 {.animated.fadeInUp.delay-1600}

---

<slide>

`JavaScript`

:::div {.text-cols}

**对比语言**
  - C的开发门槛高，业务开发困难
  - Haskell太过复杂
  - Lua本身有很多阻塞IO库
  - Ruby虚拟机性能不好

**JavaScript的优势**
  - 开发门槛低
  - 没有阻塞IO库的历史包袱
  - JavaScript在浏览器广泛使用事件驱动
  - V8的性能优势

:::

<slide class="aligncenter">

![Chrome浏览器和Node的组件结构](https://gitee.com/SCD-Wear/img-bed/raw/master/nodeweb/chrome-node-strctural.png)

Chrome浏览器和Node的组件结构

---

<slide image="https://gitee.com/SCD-Wear/img-bed/raw/master/nodeweb/037d4cfe-12fa-4a11-9bec-4b0519a01ea3.png .right">

:::{.content-left}

### 异步I/O

IO密集型 编程模式的发展：

```md
进程 ——> 线程 ——> **异步** ——> 协程
```

异步I/O的优势：

- 用户体验
- 资源分配

<slide class="size-60" aligncenter>

#### 阻塞与非阻塞

:::shadowbox

## 阻塞IO

**阻塞IO**的一个特点是 调用之后一定要等待 系统内核层面完成操作后，调用才结束.

---

## 非阻塞IO

**非阻塞IO** 调用后会立即返回

非阻塞的问题： 如何确定I/O操作是否完成 —— **轮询** <sup>[8]</sup>

:::

<slide class="size-50" aligncenter>

#### 轮询方式

---

1. 循环read: 通过重复调用来 <u>查询I/O状态</u>。最原始，性能最低
1. select
1. poll
1. epoll
1. AIO（异步I/O方式）
1. 线程池模拟异步I/O

<slide class="aligncenter">

![基于libuv的框架示意图](https://gitee.com/SCD-Wear/img-bed/raw/master/nodeweb/a44e08f0-dc6b-4c76-b3b7-7bfe8f8529f8.png)

<slide class="aligncenter" image="https://gitee.com/SCD-Wear/img-bed/raw/master/nodeweb/eventloop.jpg .right">

#### 事件驱动

---

:::{.content-left}

**事件驱动的实质**：通过主循环（Event Loop）加事件触发的方式来运行程序

node进程启动时，会创建一个类似于 while(true) 的循环，每执行一次循环体的过程 称为`Tick`.

每个Tick的过程就是查看是否有事件待处理，如果有，就取出事件的回调函数 执行；然后进入下次循环。

<slide class="aligncenter">

Node.js 的运行机制如下:

- V8 引擎解析 JavaScript 脚本。
- 解析后的代码，调用 Node API。
- libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个 Event Loop（事件循环），以异步的方式将任务的执行结果返回给 V8 引擎。
- V8 引擎再将结果返回给用户。

<slide class="aligncenter" image="http://oshoutian.gitee.io/front_end_interview/7-Event%20Loop_files/1670c3fe3f9a5e2b .right">

:::{.content-left}

##### libuv引擎中的事件循环

---

分为 6 个阶段：

- **timer**
- **I/O**
- **idle, prepare**
- **poll**
- **check**
- **close callbacks**

---

<slide class="aligncenter" image="http://oshoutian.gitee.io/front_end_interview/7-Event%20Loop_files/16740fa4cd9c6937 .right">

###### 对比一下: 浏览器中的 Event Loop

:::{.content-left}

- **微任务** 包括 process.nextTick ，promise ，MutationObserver。

- **宏任务** 包括 script ， setTimeout ，setInterval ，setImmediate ，I/O ，UI rendering。

<slide class="size-60 aligncenter">

#### 单线程

Node在在V8引擎上构建，所以它的模式和浏览器类似，JavaScript运行在单个进程的单个线程上。

:::div {.text-cols}

优点：

程序状态 单一，没有多线程情况中的 `锁`, `线程同步` 等问题，减少操作系统在调度时的上下文切换

缺点：

- 单线程 不能充分利用多核CPU -- (性能)
- 一旦单线程上抛出的异常没有被捕获，会引起整个进程的奔溃 -- (健壮性/稳定性)

:::

<slide class="aligncenter" image="https://gitee.com/SCD-Wear/img-bed/raw/master/nodeweb/cluster.png .right">

:::{.content-left}

##### 解决的方法：集群

**主从模式** :

- 主进程：负责调度或管理工作进程，不负责具体的业务处理
- 工作进程：负责具体的业务处理

> 启动多个进程只是为了充分将CPU资源利用起来，而不是为了解决并发问题；并发是靠事件驱动的方式。

<slide class="size-30 aligncenter">

集群稳定需要考虑：

- 性能问题
- 多个工作进程的存活状态管理
- 工作进程的平滑重启
- 配置或静态数据的动态重新载入
- 其它细节


<slide class="size-30 aligncenter">

#### node web 的实现

---

- 简单的实现
- 封装中间件的实现

---

<slide class="size-60 aligncenter">

### 简单的实现

node.js 内置了 `http` package, 可以很容易的实现 web server的功能。

```js
var http = require('http')

const PORT = 4337
const HOST = '127.0.0.1'

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(PORT, HOST);

console.log(`服务运行： http://${HOST}:${PORT}/`)
```

<slide class="size-60 aligncenter">

### 封装中间件的实现

```js
const http = require('http')
const url = require('url')
const { pathRegexp } = require('./util')
const { resJSON, querystring } = require('./middleware')
const bodyParser = require('body-parser')

const routes = { all: [] };
const app = {};

app.use = function(path) {
    let handle;
    if (typeof path === 'string') {
        handle = {
            path: pathRegexp(path),
            stack: Array.prototype.slice.call(arguments, 1)
        };
    } else {
        handle = {
            path: pathRegexp(),
            stack: Array.prototype.slice.call(arguments, 0)
        }
    }
    routes.all.push(handle)
}

const methods = ['get', 'put', 'delete', 'post']
methods.forEach(method => {
    routes[method] = [];
    app[method] = (path, action) => {
        const handle = {
            path: pathRegexp(path),
            stack: action
        };
        routes[method].push(handle);
    };
});

const handle = (req, res, stack) => {
    const next = (err) => {
        if (err) {
            return handle500(err, req, res, stack)
        }
        const middleware = stack.shift();
        if (middleware) {
            // 传入next()函数自s身，使中间件能够执行结束后递归
            try {
                middleware(req, res, next)
            } catch (error) {
                next(error)
            }
        }
    }

    next();
}

app.use(resJSON);
app.use(bodyParser.json())
app.use(querystring);

const requestListener = (req, res) => {
    const match = (pathname, routes) => {
        let stacks = [];
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const reg = route.path.regexp;
            const keys = route.path.keys;
            const matched = reg.exec(pathname);
            if (matched) {
                const params = {};
                for (let i = 0, l = keys.length; i < l; i++) {
                    const value = matched[i + 1];
                    if (value) {
                        params[keys[i]] = value; 
                    }
                }
                req.params = params;
                stacks = stacks.concat(route.stack)
            }
        }
        return stacks;
    }
    const pathname = url.parse(req.url).pathname;
    const method = req.method.toLowerCase();
    let stacks = match(pathname, routes.all);
    if (Object.hasOwnProperty.call(routes, method)) {
        stacks = stacks.concat(match(pathname, routes[method]));
    }

    if (stacks.length) {
        handle(req, res, stacks);
    } else {
        handle404(req. res);
    }
}

app.server = (port, hostname) => {
    http.createServer(requestListener).listen(port, hostname);
}

exports.app = app
```

<slide class="size-30 aligncenter">

### node web 框架

---

1. [Express](http://www.expressjs.com.cn)
1. [Koa](https://koa.bootcss.com)
1. [ThinkJs](https://thinkjs.org)
1. [nest](https://docs.nestjs.cn)
1. [Egg](https://eggjs.org)
1. [MidwayJS](https://midwayjs.org/zh-cn/)

---

<slide>
:::card {.quote}


![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574917472799&di=9b85c53db7050013802aee1877d81fe5&imgtype=0&src=http%3A%2F%2Fngdsb.hinews.cn%2Fresfile%2F2015-09-24%2F026%2F1486339_ngdsbtp_1443016294624_b.jpg)

---
> “node.JS的强大 让你走上web后端开发的道路 .”
> ==鲁迅==
