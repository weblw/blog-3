# JavaScript 性能优化

## 内存管理

内存管理介绍

- 内存：由可读写单元组成，表示一片可操作空间
- 管理：人为的去操作一片空间的申请、使用和释放
- 内存管理：开发者主动申请空间、使用空间、释放空间
- 管理流程：申请 - 使用 - 释放

```js
// 申请
let obj = {}

// 使用
obj.name = 'lg'

// 释放
obj = null
```

## JS 中的垃圾回收

JavaScript 中的垃圾

- JavaScript 中内存管理是自动的
- 对象不再被引用时是垃圾
- 对象不能从根上访问到时是垃圾

JavaScript 中的可达对象

- 可以访问到的对象就是可达对象（引用、作用域链）
- 可达的标准就是从根出发是否能够被找到
- JavaScript 中的根就可以理解为是全局变量对象

引用对象实例

```js
// xm 被 obj 引用
let obj = { name: 'xm' }

// xm 被引用第二次
let ali = obj

// obj 不再引用 xm
obj = null

// xm 还被 ali 引用，所以还是可达状态
```

可达对象实例

```js
function objGroup(obj1, obj2) {
    obj1.next = obj2
    obj2.prev = obj1

    return {
        o1: obj1,
        o2: obj2
    }
}

let obj = objGroup({ name: 'obj1' }, { name: 'obj2' })
```

这时候如果要访问 obj1 ，现在有两种方式

- obj.o1 通过 obj.o1 直接访问 obj1
- obj.o2.prev 通过 o2 的 prev 访问 obj1

也就是说 obj1 是可达对象，可通过两条路径访问到。如果我们把这两条路径断掉，那就再也无法访问到 obj1 ，这时候就是一个不可到达的对象，就会被视为垃圾处理，就会被回收。

## GC 算法介绍

GC 就是垃圾回收机制的缩写，GC 可以找到内存中的垃圾、并释放和回收空间。

- 程序中不再需要使用的对象

```js
function func () {
    name = 'lg'
    return `${name} is a coder`
}
func()
```

- 程序中不能再被访问到的对象

```js
function func () {
    const name = 'lg'
    return `${name} is a coder`
}
func()
```

GC 算法是什么？

- GC 是一种机制，垃圾回收器完成具体的工作
- 工作的内容就是查找垃圾释放空间、回收空间
- 算法就是工作时查找和回收所遵循的规则

常见 GC 算法

- 引用计数
- 标记清除
- 标记整理
- 分代回收

###  引用计数算法

#### 实现原理

- 核心思想：设置引用数，判断当前引用数是否为 0
- 引用计数器
- 引用关系改变时修改引用数字
- 引用数字为 0 时立即回收

```js
// 这三个都被 nameList 引用着，引用计数不为 0 ，就不会被回收
const user1 = { age: 11 }
const user2 = { age: 22 }
const user3 = { age: 33 }

const nameList = [user1.age, user2.age, user3.age]

function fn () {
    // 这两个会被挂在 window 上，引用计数就不是 0
    num1 = 1
    num2 = 2

    // 使用了 const 就只能在 fn 里用，这边没有被引用，引用计数就是 0
    const num3 = 3
    const num4 = 4
}
fn()
```

#### 优缺点

优点：

- 发现垃圾时立即回收
- 最大限度减少程序暂停

缺点：

- 无法回收循环引用的对象
- 时间开销大

针对循环引用问题举了个例子

```js
function fn () {
    const obj1 = {}
    const obj2 = {}

    // obj2 属于局部变量，本来应该要回收的，可执行到这边发现 obj2
    // 被 obj1.name 引用着，引用计数器不是0，obj1 也同样道理，
    // 这边出现了循环引用的情况，引用计数算法在这边无法判断是否回收
    obj1.name = obj2
    obj2.name = obj1

    return 'lg is a coder'
}
fn()
```

### 标记清除算法

#### 实现原理

- 核心思想：分标记和清除二个阶段完成
- 遍历所有对象找标记活动对象
- 遍历所有对象清除没有标记对象
- 回收相应的空间

这里通过一张算法示意图讲解下标记标记清除法的实现过程

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-1.png)

其实就是查找可达对象，从全局作用域出发去查找对象，这边全局下找到了 A、B、C 三个对象，找到对象后会进行标记。然后发现这边的 A 和 C 有引用其他对象，也就是说 A 和 C 有子类对象，当然子类也可能会有子类，所以这边都会递归判断有没有子类，有就继续查找子类，找到了 D 和 E ，并进行标记。这时候已经找不到其他对象了，标记阶段就结束了，接下来进入清除阶段。

这边的 a1 和 a2 处于全局作用域之外的，即使他们互相循环引用，但从全局作用域查找不到他们，所以 a1 和 a2 就不会被标记。到了清除阶段，标记清除算法会清除所有没有被标记的对象。

#### 优缺点

优点：

- 解决了循环引用的对象无法回收的问题

缺点：

- 会产生空间碎片化问题，不能让空间得到最大的使用

对于空间碎片化问题举了个例子：

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-2.png)

这边从根出发，也就是全局作用域下查找，只能找到 A 对象，只有 A 对象会被标记，而旁边的 B 对象和 C 对象都会被回收。这时候问题来了，每个对象的存储空间是不固定的，这边的 B 对象占用了两个空间，C 对象占用的 1 个空间，而内存的存储是连续的，BC 被回收后两块空间分散在两个地方。这就是空间碎片化。如果下一个对象进来要占 1.5 的空间，放在 A 对象那边就会剩 0.5 的空间，B 对象那又放不下，很难找到刚刚好的空间大小填充，总会剩下一些空间，不能让空间得到最大的使用。

### 标记整理算法

#### 实现原理

- 标记整理可以看作是标记清除的增强
- 标记阶段的操作和标记清除一致
- 清理阶段会先执行整理，移动对象位置

以下通过图解描述下执行过程

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-3.png)

回收前就代表标记阶段，活动状态就表示被标记的，非活动就表示没有被标记的。

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-4.png)

标记阶段完成之后，会进入整理阶段，会将所有活动状态的都移动到一边，非活动状态和空闲状态的移到另一边。

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-5.png)

回收阶段清除所有非活动状态的对象，这样空间状态都放一起了，就不会出现空间碎片化的情况，就能最大程度的利用空间。


### 常见 GC 算法总结

| 名称 | 优缺点 | 缺点 |
| --- | ----- | --- |
| 引用计数 | 可以立即回收垃圾对象 <br> 减少程序卡顿时间 | 无法回收循环引用的对象 <br> 资源消耗较大 |
| 标记清除 | 可以回收循环引用的对象 | 容易产生碎片化空间，浪费空间 <br> 不会立即回收垃圾对象 |
| 标记整理 | 可以回收循环引用的对象 <br> 减少碎片化空间 | 不会立即回收垃圾对象 |

## 认识 V8

- V8 是一款主流的 JavaScript 执行引擎
- V8 采用即时编译
- V8 内存设限

### 垃圾回收策略

- 采用分代回收的思想
- 内存分为新生代、老生代
- 针对不同对象采用不同算法

V8 中常用 GC 算法：

- 分代回收
- 空间复制
- 标记清除
- 标记整理
- 标记增量

### 新生代对象回收

#### 内存分配

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-6.png)

V8 内存空间一分为二

- 小空间用于存储新生代对象，64位操作系统 32M ，32位操作系统 16M
- 新生代指的是存活时间较短的对象

关于存活时间限定，举个例子，定义在函数里的局部变量在函数执行完成后就会被回收，这种就属于存活时间短。而定义在全局变量需要在整个程序结束之后才回收，这种存活时间就比较长。

#### 回收实现

回收过程采用：复制算法 + 标记整理

- 新生代内存区分为二个等大小空间
- 使用空间为From，空闲空间为To
- 活动对象存储于From空间
- 标记整理后将活动对象拷贝至To
- From与To交换空间完成释放（交换空间是指 From 和 To 名词交换，这时候 To 里存的是垃圾，释放就是释放这时候 To 里的内容）

#### 回收细节说明

拷贝过程中可能出现晋升，晋升就是将新生代对象移动至老生代。

晋升的条件：

- 一轮GC还存活的新生代需要晋升
- To空间的使用率超过25%

### 老生代对象回收

- 老生代对象存放在右侧老生代区域
- 64位操作系统 1.4G ，32位操作系统 700M
- 老年代对象就是指存活时间较长的对象（比如全局对象、闭包对象）

#### 回收实现

- 主要采用标记清除、标记整理、增量标记算法
- 首先使用标记清除完成垃圾空间的回收
- 采用标记整理进行空间优化（新生代对象晋升时出现空间不足的时候）
- 采用标记增量进行效率优化

#### 细节对比

- 新生代区域垃圾回收使用空间换时间
- 老生代区域垃圾回收不适合复制算法

#### 标记增量如何优化

下图描述标记增加是如何进行效率优化的：

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-7.png)

标记清除和标记整理都是等程序执行完成之后才开始遍历对象进行标记，就如图上前两个区域。这样标记操作全部放一起可能会导致等待时间太长。而标记增量就是把这个过程拆分成好几段，程序执行和标记操作交替完成。

这边是老生代对象，经常会出现对象有子对象的，所以经常需要遍历对象。我们就可以执行完父类对象就做个标记，再执行子类对象再做标记，再子类的子类。这样交替执行，等待的时间就分散开，就不会产生很长的等待时间，最后再一次性清除。

### 垃圾回收总结

- V8 是一款主流的 JavaScript 执行引擎
- V8 内存设置上限
- V8 采用基于分代回收思想实现垃圾回收
- V8 内存分为新生代和老生代
- V8 垃圾回收常见的GC算法

## Performance 工具

- GC的目的是为了实现内存空间的良性循环
- 良性循环的基石是合理使用
- 时刻关注才能确定是否合理
- Performance提供多种监控方式

### Performance 使用步骤

1. 打开浏览器输入目标网址
2. 进入开发人员工具面板，选择性能
3. 开启录制功能，访问具体界面
4. 执行用户行为，一段时间后停止录制
5. 分析界面中记录的内存信息

## 内存问题的体现

内存问题的外在表现：

- 页面出现延迟加载或经常性暂停（频繁垃圾回收，出现让内存瞬间暴涨的代码）
- 页面持续性出现糟糕的性能（内存膨胀，页面申请的内存空间太大）
- 页面的性能随时间延长越开越差（内存泄露）

界定内存问题的标准：

- 内存泄露：内存使用持续升高
- 内存膨胀：在多数设备上都存在性能问题
- 频繁垃圾回收：通过内存变化图进行分析

监控内存的几种方式：

- 浏览器任务管理器
- Timeline 时序图记录
- 堆快照查找分离 DOM
- 判断是否存在频繁的垃圾回收

### 任务管理器

任务管理器可用于监控内存变化，从而判断是否存在内存问题。

以下是测试代码：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>任务管理器监控内存</title>
</head>
<body>
    <button id="btn">Add</button>
    <script>
        var btn = document.getElementById('btn')

        btn.onClick = function () {
            var arrList = new Array(10000000)
        }
    </script>
</body>
</html>
```

以 mac 谷歌浏览器为例，右键浏览器标签栏，选择 “任务管理器” 就能看到以下界面：

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-8.png)

如果你的任务管理器没有 “JavaScript 使用的内存” 那一列，那就在表头那边右键

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-9.png)

把 “JavaScript 使用的内存” 勾选了就有了。

打开测试页面，在任务管理器上找到对应的信息，如下图所示：

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-10.png)

监控内存其实就是看 “JavaScript 使用的内存” 那一列的内存变化，如果内存一直在增大，那就说有问题。

这时候我们在页面上点击 “Add” 按钮，这时候内存就发生变化了。

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-11.png)

内存从 833k 一下子暴涨到 1256k ，这就是存在问题了。不过任务管理器只能看出是否存在问题，并不能知道具体什么问题，无法定位问题所在位置。如果需要定位问题就需要借助其他工具了。

### Timeline

Timeline 是 Performance 里的一部分，用来记录内存的变化。可以通过内存变化分析内存问题，从而定位存在内存问题的代码区域。

以下是测试代码：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>时间线记录内存变化</title>
</head>
<body>
    <button id="btn">Add</button>
    <script>
        var arrList = []

        function test () {
            for (var i = 0; i < 100000; i++) {
                const p = document.createElement('p')
                document.body.appendChild(p)
            }
            arrList.push(new Array(100000).join('x'))
        }
        
        document.getElementById('btn').onclick = test;
    </script>
</body>
</html>
```

通过 Performance 工具监听内存，录制过程中先间断点击两下 Add 按钮，再连续点击四下 Add 按钮，得到以下的监控结果。

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-12.png)


第一次使用 Memory（内存）默认关闭的，需要打勾了才能看到 timeline 时序图。timeline 上有好几个时间线，这边我们只需要用到 “JS Heap” ，所以只留下一个打勾。

从图上我们可以看出，前半段内存上升了两次又降下来，这两次就是录制过程中间断的点了两下。后半段连续连了四下，对应 timeline 图上连续暴涨。每次上涨之后又会下降，然后趋于平稳，这是因为浏览器有垃圾回收机制。新增 DOM 和新增大容量的数组，这时候内存暴涨。之后触发垃圾回收机制，数组没被引用就被回收了，dom 节点没被回收所以内存没有下降到原来的位置。

从上面这张图来看，这代码还算正常的，因为有升的地方都有降，才就是一个正常的表现，如果是一直增加就要注意了，可能发生内存泄露了。这时候可以根据有问题的片段，查看对应的界面表现，从而定义到相关代码。

### 堆快照

堆快照可查找到分离 DOM ，什么是分离 DOM ？

DOM 元素分类两种，一种是在 DOM 树上的，属于界面元素。另一种不在 DOM 树上，这些 DOM 有的是没有对象引用的就是垃圾对象，这些会被垃圾回收。有的是有对象引用，那就是分离 DOM 。分离 DOM 没有展示出来，却占据着内存，有些分离 DOM 是永远都不会使用的，这些就需要清除掉。堆快照就是帮忙你找到这些分离 DOM 。

以下是测试代码：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>堆快照监控内存变化</title>
</head>
<body>
    <button id="btn">Add</button>
    <script>
        var tmpEle

        function test () {
            var ul = document.createElement('ul')
            for (var i = 0; i < 10; i++) {
                const li = document.createElement('li')
                ul.appendChild(li);
            }
            tmpEle = ul
        }
        document.getElementById('btn').onclick = test;
    </script>
</body>
</html>
```

堆快照工具位于开发者工具的 Memory（内存）里面，打开后可以看到下图的样子。

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-13.png)

profiling type（分析类型）的第一个 “Heap snapshot” 就是堆快照。点击 “Take snapshot” 就开始生成第一张快照。这时候会 Constructor 里面会有很多对象，我们要找的是分离 DOM ，分离 DOM 的前几个字母是 “deta” ，搜索这个关键字就能看到所有分离 DOM ，如下图所示：

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-14.png)

这时候搜到的内容是空的，说明这时候没有分离 DOM 的存在。接下来点击 “Add” 按钮，然后再生出一张快照，如下图：

![](https://jencia.github.io/images/blog/training-camp/notes/Optimization-15.png)

这时候就能搜到，能搜到就说明有问题，我们可以根据搜出来的结果找到对应的代码，从而解决内存问题。

### 判断是否存在频繁 GC

为什么确定频繁垃圾回收？

- GC 工作时应用程序是停止的
- 频繁且过长的 GC 会导致应用假死
- 用户使用中感知应用卡顿

确定频繁的垃圾回收：

- Timeline 中频繁的上升下降
- 任务管理器中数据频繁的增加减小

## 代码优化

如何精准测试 JavaScript 性能：

- 本质上就是采集大量的执行样本进行数学统计和分析
- 使用基于 Benchmark.js 的 https://jsperf.com 完成

JSPerf 使用流程：

1. 使用 Github 账号登录
2. 填写个人信息 （非必须）
3. 填写详细的测试用例信息（ title 、slug）
4. 填写准备代码（ DOM 操作时经常使用）
5. 填写必要的 setup 与 teardown 代码
6. 填写测试代码片段

### 慎用全局变量

为什么要慎用？

- 全局变量定义在全局执行上下文，是所有作用域链的顶端
- 全局执行上下一直存在于上下文执行栈，直到程序退出
- 如果某个局部作用域出现了同名变量则会遮蔽或污染全局

### 缓存全局变量

将使用中无法避免的全局变量缓存到局部。


```js
// bad
function getBtn () {
    var oBtn1 = document.getElementById('btn1')
    var oBtn3 = document.getElementById('btn3')
    var oBtn5 = document.getElementById('btn5')
    var oBtn7 = document.getElementById('btn7')
    var oBtn9 = document.getElementById('btn9')
}

// good
function getBtn () {
    var obj = document
    var oBtn1 = obj.getElementById('btn1')
    var oBtn3 = obj.getElementById('btn3')
    var oBtn5 = obj.getElementById('btn5')
    var oBtn7 = obj.getElementById('btn7')
    var oBtn9 = obj.getElementById('btn9')
}
```

### 通过原型对象添加附加方法

```js
// bad
var fn1 = function () {
    this.foo = function () {
        console.log(11111)
    }
}

// good
var fn2 = function () {}
fn2.prototype.foo = function () {
    console.log(11111)
}
```

### 避开闭包陷阱

闭包特点：

- 外部具有指向内部的引用
- 在 “外” 部作用域访问 ”内部作用域“ 的数据

关于闭包：

- 闭包是一种强大的语法
- 闭包使用不当很容易出现内存泄露
- 不要为了闭包而闭包

```js
// bad
function foo () {
    var el = document.getElementById('btn')
    el.onclick = function () {
        console.log(el.id)
    }
}

// good
function foo () {
    var el = document.getElementById('btn')
    el.onclick = function () {
        console.log(el.id)
    }
    el = null
}
```

### 避免属性访问方法使用

JavaScript 中的面向对象：

- JS 不需要属性的访问方法，所有属性都是外部可见的
- 使用属性访问方法只会增加一层重定义，没有访问的控制力

```js
// bad
function Person () {
    this.name = 'tom'
    this.age = 18
    this.getAge = function () {
        return this.age
    }
}
const p1 = new Person()
p1.getAge()

// good
function Person () {
    this.name = 'tom'
    this.age = 18
}
const p1 = new Person();
p1.age
```

### for 循环优化

```js
var btnList = document.getElementById('btn')

// bad
for (var i = 0; i < btnList.length; i++) {
    console.log(i)
}

// good
for (var i = 0, len = btnList.length; i < len; i++) {
    console.log(i)
}
```

### 选择最优的循环方法

```js
var arr = [1, 2, 3, 4, 5]

// bad
for (var i = 0, len = arr.length; i < len; i++) {
    console.log(item[i])
}

// bad
for (var i in arr) {
    console.log(arr[i])
}

// good
arr.forEach(function (item) {
    console.log(item)
})
```

### 文档碎片优化节点添加

```js
// bad
for (var i = 0; i < 10; i++) {
    var p = document.createElement('p')
    p.innerHTML = i
    document.body.appendChild(p)
}

// good
const fragEle = document.createDocumentFragment()
for (var i = 0; i < 10; i++) {
    var p = document.createElement('p')
    p.innerHTML = i
    fragEle.appendChild(p)
}
document.body.appendChild(fragEle)
```

### 克隆优化节点操作

```js
// bad
for (var i = 0; i < 10; i++) {
    var p = document.createElement('p')
    p.innerHTML = i
    document.body.appendChild(p)
}

// good
var p = document.createElement('p')
for (var i = 0; i < 10; i++) {
    var newP = p.cloneNode(false)
    newP.innerHTML = i
    document.body.appendChild(newP)
}
```

### 直面量替换 new Object

```js
// bad
var a1 = new Array(3)
a1[0] = 1
a1[1] = 2
a1[2] = 3

// good
var a2 = [1, 2, 3]
```