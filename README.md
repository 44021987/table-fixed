### 基于jq的表格固定表头和表列插件

修改了几个小BUG，直接使用引入tablefix.min.js即可。源码在src下，如有其他需求可自行修改源码，然后自行打包。

#### 使用
表格属性column控制固定的列数

```
# 需要引入jquery
<script src="tablefix.min.js"></script>
```

```javascript

// 初始化
$('.table-fixed-wrap').fixedTable()
```
#### 修改源码

```
git clone https://github.com/44021987/table-fixed.git

npm install

# 开发环境
npm run dev

# 打包
npm run build
```