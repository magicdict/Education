# Education

"数智教育"数据可视化创新大赛

- UI ： Angular代码
- WebAPI：WebAPI代码
- netcore-web-example.service : NetCore WebAPI的CentOS守护进程
- nginx.conf : Nginx服务配置 UI和WebAPI都需要配置
- weather.py : 天气获得用代码

Host URL：<http://39.105.206.6>

Release Step:

- 0.common.ts 中代码需要修改一下

```typescript
let webapiurl = "<http://39.105.206.6:8080/api/">
//let webapiurl = "<http://localhost:5000/api/">
```

- 1.dotnet publish (WebApi目录下执行)

- 2.ng build --prod --build-optimizer (UI目录下执行)

- 3.upload (将前面的发布包上传到服务器即可)
  - education.service -> /etc/systemd/system/
  - Education\UI\dist\Angular -> Education\Angular
  - Education\WebAPI\bin\Debug\netcoreapp3.0\publish -> Education\publish

- 4.systemctl restart education.service (远程执行)

备忘录：

- 等第越小越好，ZScore和TScore越大越好

- 高一高二，高三，有不同的表示逻辑

TODO:

1.按照周一，周二进行消费统计
2.按照天气，进行消费统计
3.按照天气，进行考勤统计

官方问题答案：等待中