# Education

"数智教育"数据可视化创新大赛

- UI ： Angular代码
- WebAPI：WebAPI代码
- netcore-web-example.service : NetCore WebAPI的CentOS守护进程
- nginx.conf : Nginx服务配置 UI和WebAPI都需要配置

Host URL：<http://39.105.206.6>

Release Step:

- 1.dotnet publish (发布webapi)

- 2.ng build --prod --build-optimizer

- 3.upload (将前面的发布包上传到服务器即可)

- 4.systemctl restart education.service (/etc/systemd/system/)

备忘录：

- 等第越小越好，ZScore和TScore越大越好

- 高一高二，高三，有不同的表示逻辑

TODO:

1.按照周一，周二进行消费统计
2.按照天气，进行消费统计
2.按照天气，进行考勤统计