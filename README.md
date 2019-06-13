# Education

"数智教育"数据可视化创新大赛

注意：由于PrimeNg 8.0 中omega主题变为收费，源代码中改为rhea主题。
<http://39.105.206.6> 展示的任然是omega主题，PrimeNg版本也为7.1.3
机器学习，使用手册，答辩PPT等由于体积较大，并未上传到Github，如果需要请提Issue。

运行环境

- Linux CentOS 7.4
- DotNet Core v3.0.0-preview6
- Angular 8.0.0
- echarts 4.2.1
- primaryNG 8.0.0（源代码，展示网站为7.1.3）
- 其他第三方组件

目录构成

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

NetCore 错误及其处理方法:
Unable to configure HTTPS endpoint. No server certificate was specified, and the default developer certificate could not be found.
<http://www.waynethompson.com.au/blog/dotnet-dev-certs-https/>

团队主要成员

- 胡八一：主程序
- 穆扬：美工
- 林有夕：机器学习

界面示意图：

![首页](/界面变迁图/首页20190531.png)
![考勤-概要](/界面变迁图/考勤20190531.png)
![考试-概要](/界面变迁图/考试20190531.png)
![考勤-本学期考勤数据](/界面变迁图/考勤本学期考勤数据20190531.png)
![个人-成绩趋势](/界面变迁图/个人成绩趋势0531.png)
