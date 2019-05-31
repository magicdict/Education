# Education

"数智教育"数据可视化创新大赛

运行环境

- Linux CentOS 7.4
- DotNet Core v3.0.0-preview5
- Angular 8.0.0

- UI ： Angular代码
- WebAPI：WebAPI代码
- netcore-web-example.service : NetCore WebAPI的CentOS守护进程
- nginx.conf : Nginx服务配置 UI和WebAPI都需要配置
  - /usr/local/nginx/conf
  - ./nginx 启动 (/usr/local/nginx/sbin)
  - ./nginx -s reload (/usr/local/nginx/sbin)
- weather.py : 天气获得用代码
- model.py : 机器学习代码

Host URL：<http://39.105.206.6>

Release Step:

- 0.common.ts 中代码需要修改一下

```typescript
let webapiurl = "http://39.105.206.6:8080/api/"
//let webapiurl = "http://localhost:5000/api/"
```

- 1.dotnet publish (WebApi目录下执行)

- 2.ng build --prod --build-optimizer (UI目录下执行)

- 3.upload (将前面的发布包上传到服务器即可)
  - education.service -> /etc/systemd/system/
  - Education\UI\dist\Angular -> Education\Angular
  - Education\WebAPI\bin\Debug\netcoreapp3.0\publish -> Education\publish

- 4.systemctl restart education.service (远程执行)
- ssh root@39.105.206.6 (Mac Login via SSH)

界面示意图：

![首页](/界面变迁图/首页20190531.png)
![考勤-概要](/界面变迁图/考勤20190531.png)
![考试-概要](/界面变迁图/考试20190531.png)
![考勤-本学期考勤数据](/界面变迁图/考勤本学期考勤数据20190531.png)
![个人-成绩趋势](/界面变迁图/个人成绩趋势0531.png)
