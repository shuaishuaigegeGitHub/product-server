# 产品管理后端


## 开发环境
```bash
# 安装依赖
yarn
```

## 服务端部署

1. 添加配置文件

```bash
# 添加 .env 填写正确的配置信息
cp .env.example .env
```

2. 创建数据库（默认用MySQL）

#### 平台采用分多个数据库的模式开发

基础数据库：`product` <br/>
charset: `utf8mb4`<br/>
排序规则：`utf8mb4_general_ci`<br/>
`具体数据表请联系管理员获取`

```bash
# 初始化数据表
```

## 启动服务

```bash
# 开发环境
yarn nodemon

# 生产环境
yarn start
```
