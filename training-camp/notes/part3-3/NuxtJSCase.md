# NuxtJS 综合案例

使用 NuxtJS 实现 RealWorld 全部功能

示例地址：https://demo.realworld.io/

静态页面模板和接口 API 直接使用 [realworld-starter-kit](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md)

## 创建项目

```sh
$ mkdir realworld-nuxt  # 创建项目目录
$ cd realworld-nuxt     # 进入目录

$ yarn init --yes       # 初始化项目
$ yarn add nuxt         # 安装 nuxt
```

修改 `package.json` 添加 `scripts`

```diff
{
  "name": "realworld-nuxt",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
+ "scripts": {
+   "dev": "nuxt",
+   "start": "nuxt start",
+   "build": "nuxt build"
+ },
  "dependencies": {
    "axios": "^0.20.0"
  }
}
```

各命令行的作用：

- `nuxt` 启动开发环境
- `nuxt start` 启动 web 服务器访问打包文件
- `nuxt build` 项目打包

创建 git 忽略文件 `.gitignore`

```
node_modules
.nuxt
```

## 创建首页

创建 `pages` 文件夹，并在文件夹下创建 `index.vue` 文件，此时的项目结构是这样的：

```
├─ node_modules/
├─ pages/
│   └─ index.vue
├─ package.json
└─ yarn.lock
```

编辑 `pages/index.vue` 文件：

```html
<template>
    <div>Hello World!</div>
</template>

<script>
export default {
    name: 'Home'
}
</script>
```

启动项目：

```sh
$ yarn run dev
```

访问页面：http://localhost:3000/ 

如果能正常访问，页面就创建成功。

## 导入资源文件

创建 `app.html` 文件，从 [NuxtJS 官网](https://zh.nuxtjs.org/guide/views) 找到默认的模板，复制到 `app.html` 里

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

在 [realworld-starter-kit](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md) 里找到 `Header` 模板，复制 `<link>` 部分到 `app.html` 文件：

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
    <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
    <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="//demo.productionready.io/main.css">
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

这边用到 `ionicons`，这个库可以在 CDN 里找到，而这边用到的 CDN 是国外的，所以我们可以换成国内的 CDN，可以在 [jsdelivr](https://www.jsdelivr.com/) 上搜索 `ionicons` 找到同样的版本 `2.0.1` ，复制 `ionicons.min.css` 的 CDN 地址。

```diff
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
-   <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
+   <link href="https://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
    <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="//demo.productionready.io/main.css">
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

这边的 `//demo.productionready.io/main.css` 也是挂载在国外的，可以直接下载到本地，引用本地文件。将地址粘贴到浏览器地址栏，前面加上 `http:` 访问，然后下载到本地，改名为 `index.css`。

创建 `static` 目录，将 `index.css` 文件丢进去，然后就可以通过 `/index.css` 路径访问到。

```diff
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
    <link href="https://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
    <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
-   <link rel="stylesheet" href="//demo.productionready.io/main.css">
+   <link rel="stylesheet" href="/index.css">
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

## 创建布局组件

创建 `layouts/default.vue` 文件，内容从 `Header` 和 `Footer` 模板里面取，只拿 `body` 里面的代码就好。使用 `<nuxt>` 来接收页面内容作为内容层。最终代码如下：

```html
<template>
    <div>
        <nav class="navbar navbar-light">
            <div class="container">
                <a class="navbar-brand" href="index.html">conduit</a>
                <ul class="nav navbar-nav pull-xs-right">
                <li class="nav-item">
                    <!-- Add "active" class when you're on that page" -->
                    <a class="nav-link active" href="">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="">
                    <i class="ion-compose"></i>&nbsp;New Post
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="">
                    <i class="ion-gear-a"></i>&nbsp;Settings
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="">Sign up</a>
                </li>
                </ul>
            </div>
        </nav>
        <nuxt />
        <footer>
            <div class="container">
                <a href="/" class="logo-font">conduit</a>
                <span class="attribution">
                An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
                </span>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'DefaultLayout'
}
</script>
```

## 创建各个页面

根据 [realworld-starter-kit](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md) 的路由设计和 NuxtJS 的路由自动化机制，创建如下结构的页面文件：

```
pages
├─ article/
│   └─ _slug.vue 
├─ editor/
│   └─ _slug.vue 
├─ profile/
│   └─ _username.vue
├─ index.vue
├─ login.vue
├─ register.vue
└─ settings.vue
```

从模板那复制相应的代码到对应页面里。不过有些页面模板的一样的，就需要提取到公共组件里，再引用同一个组件。

- login 和 register 内容一样，提取出 `components/Auth.vue` 组件

## 封装请求模块和方法

安装 axios 模块：

```sh
$ yarn add axios
```

创建 `utils/request.js` 文件，设置请求基本地址：

```js
import axios from 'axios'

const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})

export default request
```

根据realword 提供的 [接口 API 文档](https://github.com/gothinkster/realworld/tree/master/api) 封装对应的请求方法。

根据接口类别创建 `api/user.js`、`api/article.js`、`api/profiles.js`、`api/tag.js` 。例如 `api/user.js` 代码如下：

```js
import request from '@/utils/request'

export function login (data) {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}

export function register (data) {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}
```

## 登录/注册

### 页面联调

`components/Auth.vue`

```js
export default {
    // ...
    computed: {
        isLogin () {
            return this.$route.name === 'login'
        }
    }
    // ...
}
```

通过路由判断是登录页还是注册页，后续通过 `isLogin` 来处理登录和注册的不同逻辑。

```js
export default {
    data () {
        return {
            user: {
                username: '',
                email: '',
                password: ''
            },
            loading: false,
            errors: null
        };
    },
    // ...
}
```

状态数据设计：

- `user` 用来收集用户填写的表单数据，数据结构与接口入参结构保持一致；
- `loading` 提交数据时，改为 `true` ，按钮禁用，防止重复提交，提交调用结束后再改回 `false` ；
- `errors` 用来展示错误信息，表单提交时接口发生异常，将异常信息赋值给 `errors` ，这便是表单校验失败的错。

```html
<form @submit.prevent="handleSubmit">
    ...
</form>
```

使用 `<form>` 的 `submit` 事件触发表单提交事件 ，同时在 `methods` 里增加 `handleSubmit` 方法。

```js
import { register, login } from '@/api/user'

async handleSubmit () {
    try {
        this.loading = true
        // login 和 register 方法是之前定义的网络请求方法
        const res = await (this.isLogin ? login : register)({ user: this.user })
        const { user } = res.data || {}     // 获取后端返回的数据

        this.errors = null	    // 重置错误信息
        this.$store.commit('setUser', user) // 将数据存到 vuex 里
        this.$router.push('/')  // 登录或注册完成跳转到首页
    } catch (e) {
        this.errors = e.response.data.errors
    } finally {
        this.loading = false
    }
}
```

### 数据持久化

登录后会返回用户信息，用户信息在很多页面都需要用到，所以需要存在 vuex 里。

存在 vuex 的数据页面刷新完就不见了，就要重新登录，为了让登录状态可以一直保留下去，需要做数据持久化。 由于这数据在客户端和服务端都能访问，所以使用 cookie 存储。

创建 `store/index.js` 文件，NuxtJS 会自动导入 `store` 目录下的 vuex 文件。

```js
import cookie from 'js-cookie'           // 客户端操作 cookie
import cookieParser from 'cookieparser'  // 服务端解析 cookie

// state、mutations、actions 都要分别导出，且 state 要使用函数

export const state = () => ({
    user: null
})

export const mutations = {
    setUser (state, payload) {
        cookie.set('user', payload) // 将数据存到 cookie 里
        state.user = payload
    }
}

export const actions = {
    // 一个特殊的方法，名称固定，NuxtJS 服务端渲染前会调用这个方法
    nuxtServerInit ({ commit }, { req }) {
        let user = null

        if (req.headers.cookie) {
            // 在服务端解析获取 cookie
            const parsed = cookieParser.parse(req.headers.cookie || '')

            try {
                // 获取 cookie 上存储的 user，可能拿不到，所以包一个 try…catch
                user = JSON.parse(parsed.user)
            } catch (e) {}
        }

        // 数据提交给 vuex
        commit('setUser', user)
    }
}
```

### 权限控制

1. 操作权限控制

头部菜单没登录时只展示首页、登录、注册，登录后展示首页、写文章、设置、个人中心，拿 vuex 的 user 判断是否已经登录。

2. 访问权限控制

为防止用户通过页面访问地址直接访问，需要设置访问权限。NuxtJS 提交了一个中间件的概念用来解决这类问题：

创建 `middleware/authenticated.js` 文件：

```js
export default function ({ store, redirect }) {
    // 用户信息没值时重定向到登录页
    if (!store.state.user) {
        redirect('/login')
    }
}
```

```html
<template>
	...
</template>
<script>
export default {
    name: 'Settings',
    middleware: 'authenticated'
}
</script>
```

中间件固定存放在 `middleware` 文件夹里，一个中间件一个文件。使用 `middleware` 属性使用中间件，中间件的名字就是文件名。

以上代码的意思时给设置页设置访问权限，没登录时跳转到登录页。

没登录时不能访问的是：

- 文章发布/编辑页
- 设置页
- 个人中心页

登录后同样也有些页面无法访问，需要创建另外一个中间件：`middleware/notAuthenticated.js`

```js
export default function ({ store, redirect }) {
    // user 有值时代表已登录，访问不该访问的页面重定向到首页
    if (store.state.user) {
        redirect('/')
    }
}
```

登录后不能访问的是：

- 登录页
- 注册页

## 首页开发

### 文章列表联调

新建一个 `api/article.js` 文件，设置获取文章列表接口方法：

```js
import request from '@/utils/request'

export function getArticles (params) {
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    })
}
```

在 asyncData 方法内调用接口方法，返回结果

```js
export default {
    // ...
    async asyncData () {
        const { data } = await getArticles()

        return {
            articles: data.articles,
            articlesCount: data.articlesCount
        }
    },
}
```

接口数据返回结果可以到 [这里](https://github.com/gothinkster/realworld/tree/master/api#multiple-articles) 查看数据结构，也可以把 data 打印出来，或者在 Vue devtools 查看返回的状态数据。

联调说明：

- 根据数据名称填入对应的位置
- `slug` 属性为文章的 id，进入文章详情可传 `slug` 作为唯一 ID
- 进入用户中心通过传入用户名 `article.author.username` 作为唯一 ID
- 将 `<a>` 标签转为 `<nuxt-link>`
- 是否点赞和是否是当前页码的样式通过设置 class 为 `active` 控制。
- 时间格式的转化可引入 `dayjs` 模块通过过滤器控制。

### 分页处理

文章列表部分缺少分页器的代码，可到 [Demo 页面](https://demo.realworld.io/#/) 拷贝分页器部分的内容，删掉没有的代码留下以下代码：

```html
<nav>
    <ul class="pagination">
        <li class="page-item active">
            <a class="page-link">1</a>
        </li>
    </ul>
</nav>
```

放在文章列表内容部分（ class 名为 `article-preview` 的）后面。

设置数据状态：

- `page` 当前页码，从路由的 query 属性里取，取不到就默认为 1
- `limit` 每页显示的条数，固定为 10

接口的分页是通过传入 `limit` 和 `offset` 属性来控制，每页显示的条数和偏移量（即当页第一条数据的位置），偏移量可以通过 `page` 值和 `limit` 值算出。最终 `asyncData` 方法可以改成如下：

```js
export default {
    // ...
    async asyncData (context) {
        const limit = 10
        // query 取到的是字符串，前面加 "+" 是为了转成 number 类型
        const page = +(context.query.page || 1)
        const { data } = await getArticles({
            limit,
            offset: (page - 1) * limit
        })

        return {
            limit,
            page,
            articles: data.articles,
            articlesCount: data.articlesCount
        }
    },
}
```

分页器的总页数通过 `articlesCount` 和 `limit` 算出：

```js
export default {
    // ...
    computed: {
        totalPage () {
            return Math.floor(this.articlesCount / this.limit)
        }
    },
}
```

由于 `v-for` 可以进行数字的遍历，所以可以通过遍历 `totalPage` 值来展示分页器的各个页码。页码的链接跳转到当前页，只是需要传 `page` 参数，最终分页器的代码如下：

```html
<nav>
    <ul class="pagination">
        <li
            v-for="num in totalPage"
            :key="num"
            class="page-item"
            :class="{ active: num === page }"
        >
            <nuxt-link class="page-link" :to="`/?page=${num}`">
                {{ num }}
            </nuxt-link>
        </li>
    </ul>
</nav>
```

这时候你去点击页码，你会发现文章列表数据并没有变化，但当你刷新下页面，是能展示对应的文章数据。这是页面跳转走的是前端渲染，并不会去重新调用 `asyncData` 方法，就导致数据还是旧的。只有走服务端渲染的时候才会去调 `asyncData` 方法。为了解决这种场景，NuxtJS 提供了一个 `watchQuery` 属性用来监听地址是的查询参数，使用方式如下：

```diff
export default {
    ...
    async asyncData (context) {
        ...
    },
+   watchQuery: ['page'],
    computed: {
        ...
    }
}
```

这时候当检测到查询参数里的 `page` 值发生变化就会去调 `asyncData` 方法，就能得到期望的数据。

### 标签处理

标签处理大部分沿用 "分页处理" 的思路，需要注意的有以下几点：

- 标签的引入使得 `asyncData` 需要多调用一个接口，多个互不依赖的接口可以通过 Promise.all 并行请求。
- 分页的点击链接需要多传一个 `tag` 参数

### 导航选项卡处理

选项卡包括 “关注”、“推荐”、“标签”，其中 “关注” 是登录后才能看到，“标签” 是搜索指定标签才展示，并且文章内容为 `#` + 标签名。由此选项卡的数据可以这样写：

```js
export default {
    // ...
    computed: {
        // ...
        tabsOptions () {
            const options = [{ label: '推荐', value: 'global_feed' }]

            this.user && options.unshift({ label: '关注', value: 'you_feed' })
            this.tag && options.push({ label: `# ${this.tag}`, value: 'tag' })
            return options
        }
    }
}
```

`this.user` 是通过 Vuex 的 `mapState` 注入的数据，登录后才会有数据，没登录的话就是 `null `。

`this.tag` 是在 `asyncData` 里定义的，通过地址上的查询参数取到值。

视图上的调整如下：

```html
<div class="feed-toggle">
    <ul class="nav nav-pills outline-active">
        <li class="nav-item" v-for="item in tabsOptions" :key="item.value">
            <nuxt-link
                class="nav-link"
                :class="{ active: item.value === tab }"
                :to="{
                    path: '/',
                    query: {
                        tab: item.value,
                        tag: item.value === 'tag' ? tag : undefined
                    }
                }"
            >
                {{ item.label }}
            </nuxt-link>
        </li>
    </ul>
</div>
```

切换 Tab 时查询参数传入 `tab` 和 `tag` ，当 Tab 不是处于标签时不传递 `tag` 值，值设置为 `undefined` 就意味着 `tag` 参数会被过滤。

关于 `page`、`tab`、`tag` 三个参数的变化逻辑：

- 点击选项卡时，传入 `tab` ，当选项卡是标签时多传一个 `tag`
- 点击标签时，传入 `tab` 和 `tag` ，其中 `tab` 的值固定是 `'tag'`
- 点击分页时，传入 `page`、`tag`、`tab`，其中如果 `tag` 为 `undefined` 将忽略 `tag`

### 统一设置用户 Token

导航选项卡里“关注”所调用的数据跟其他两个都不一样，这边展示的是当前用户的收藏数据，所以这边请求逻辑需要调整下：

```js
export default {
    async asyncData () {
        // ...
        const loaderArticles = tab === 'you_feed' ? getArticlesFeed : getArticles

        const [articleRes, tagData] = await Promise.all([
            loaderArticles({ tag, limit, offset: (page - 1) * limit }),
            getTags()
        ])
        // ...
    }
}
```

`getArticlesFeed` 调用的接口地址是 `/api/articles/feed` 。

如果用之前的写法去调用接口，这时会报 `401` 错误。原因是因为 `/api/articles/feed` 接口需要知道你是哪个用户，所以需要传递用户 Token ，接口说明注明了 Token 的传值方式是请求时设置一个 headers 数据，键为 `Authorization` ，值的格式为 `Token 你的Token数据` ，例如 `Token adadadadada...`。

设置 Token 可以借助 axios 的拦截器机制实现，每一个请求都设置 Token 值，修改 `utils/request.js` 文件

```js
// ...
request.interceptors.request.use(config => {
    config.headers.Authorization = 'Token 你的Token'

    return config
})
// ...
```

这边是能统一设置 Token ，但是这里 Token 值并不知道。Token 是在用户信息里获取的，而用户信息又是存在 Vuex 里的，所以想要拿到 Token 就需要注入 Vuex 的数据。

NuxtJS 为我们提供了 [插件机制](https://zh.nuxtjs.org/guide/plugins) ，在运行 Vue 应用之前会执行插件。通俗的说就是定义一个函数，NuxtJS 会帮你先运行这个函数，再去执行 Vue 代码，也就会在 asyncData 函数之前执行，因此我们可以在 asyncData 调用之前注入一些数据或做一些逻辑处理。

插件可以拿到上下文对象，也就可以拿到 Vuex 数据，所以请求拦截器可以在插件里处理。创建 `plugins/request.js`：

```js
import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})

// 插件入口文件是导出的默认函数
export default ({ store }) => {
    // 设置请求拦截器
    request.interceptors.request.use(config => {
        const { user } = store.state

        // 当存在 token 值是设置请求头 Authorization
        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`
        }
        return config
    })
}
```

之前的 `utils/request.js` 可以删掉了，之前的网络请求方法就使用这边的 `request` 。注意：之前的 `request` 是以默认值导出，但这边必须以成员导出，所以对于的导入代码需要跟着改。

定义完插件文件要记得注册插件，创建 NuxtJS 配置文件 `nuxt.config.js` ：

```js
export default {
    // ~ 表示项目根路径
    plugins: ['~/plugins/request']
}
```

### 文章点赞

点赞接口都是 `/api/articles/${slug}/favorite` ，添加点赞是 POST 请求，取消点赞是 DELETE 请求。

给点赞按钮绑定事件方法 `handleFavorite`：

```js
export default {
    // ...
    methods: {
        // 接收文章对象
        async handleFavorite (article) {
            // 不管是添加点赞还是取消点赞都会返回一个全新的文章对象
            const { data: { article: newArticle } } = article.favorited
                ? await deleteFavorite(article.slug)
                : await addFavorite(article.slug)

            // 赋值新的数据，响应数据变化后视图会跟着更新
            article.favorited = newArticle.favorited
            article.favoritesCount = newArticle.favoritesCount
        }
    }
}
```

以上功能已经是实现的了，但是存在网络差的情况，接口请求不能马上响应，会导致用户以为没点成功，会再点一下，就导致重复请求。为了防止重复请求的情况，点赞按钮点下去的时候应该处于禁用状态，等接口得到响应了再解除禁用。

由于 `articles` 不存在禁用状态的字段，所以我们需要在 `asyncData` 里给每一个 `article` 都添加点赞禁用状态：

```js
articles.forEach(v => (v.favoriteDisabled = false))
```

其实不设置值默认是 `undefined` ，`undefined` 转成布尔值就是 `false` 。但如果不在初始化的时候设置初始值，就不属于响应式数据，后续去修改值就不会触发视图更新。

就禁用字段用上去，这时的视图是这样：

```html
...
<button
    class="btn btn-sm pull-xs-right btn-outline-primary"
    :class="{ 'active': article.favorited }"
    :disabled="article.favoriteDisabled"
    @click="handleFavorite(article)"
>
    <i class="ion-heart"></i> {{ article.favoritesCount }}
</button>
...
```

`handleFavorite` 需要在请求开始前将 `favoriteDisabled` 设置为 `true` ，在请求结束后设置为 `false` ，如下：

```diff
export default {
    // ...
    methods: {
        // 接收文章对象
        async handleFavorite (article) {
+           article.favoriteDisabled = true
            const { data: { article: newArticle } } = article.favorited
                ? await deleteFavorite(article.slug)
                : await addFavorite(article.slug)

            article.favorited = newArticle.favorited
            article.favoritesCount = newArticle.favoritesCount
+           article.favoriteDisabled = false
        }
    }
}
```

每一个发起网络请求的地方都需要注意这个问题，都要问问自己，这边是否有可能会引发重复请求，如果有可能出现就需要做类似的处理。

## 部署

其他页面的联调都差不多，就不一一讲解了，接下来讲下部署环节。

NuxtJS 项目既有前端代码又有后端代码，需要放在能够支持 NodeJS 的服务器上。Vercel 提供了一个免费的项目托管平台，这上面能够支持 NuxtJS 的运行。

可以从 [NuxtJS 英文官网上](https://nuxtjs.org/faq/now-deployment) 找到相关部署教程，这上面文档写得有点简单，下列详细讲下操作流程：

1. 注册 Vercel

    进 [官网](https://vercel.com/) 找到 Sign Up ，使用 Github 进行注册。注意：使用 QQ 邮箱可能会注册失败，需要将 Github 的主邮箱地址改成非 QQ 邮箱的。

2. 全局安装 Vercel

    ```sh
    $ yarn global add vercel
    ```

3. 配置项目

    创建配置文件 `vercel.json`

    ```json
    {
        "version": 2,
        "builds": [
            {
                "src": "nuxt.config.js",
                "use": "@nuxtjs/now-builder"
            }
        ]
    }
    ```

    创建忽略文件 `.vercelignore`

    ```
    .nuxt
    ```

4. 命令行登录 Vercel

    第一次使用需要登录

    ```sh
    $ vercel login
    ```

    输入邮箱后，提示需要到邮箱那边点确认，确认后就完成登录

5. 部署

    ```sh
    # 第一次部署
    $ vercel

    # 后续再次部署
    $ vercel --prod
    ```

    部署完后会把访问地址打印出来，点开就能访问