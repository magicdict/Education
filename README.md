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

备忘录：

- 等第越小越好，ZScore和TScore越大越好

- 高一高二，高三，有不同的表示逻辑

TODO:

1.按照周一，周二进行消费统计 [全校级别完成了]
2.天气信息的活用，进行消费统计，进行考勤统计
3.寝室宿舍系的考虑：住宿学生的比例，同宿舍学生之间的关联等
4.教师按照课程进行统计（注意：通用技术和信息技术合并一下，英语选修9，英语2，1B模块总分过滤掉）
5.IB的学生可能没有成绩的，同样对于某些学生没有考勤记录，也需要做特殊处理
6.首页标签群：白杨，东部校区人数；住校人数；

官方问题答案：

- 考勤类型表：默认信息是指什么？早上迟到和晚到学校有啥区别啊？考勤信息里面是不是除了违规行为（迟到早退校服校徽）之外还有正常的进校离校考勤啊，哪些是违规的，那些是正常的，能不能让校方给一个考勤类型的详细说明啊。
- 关于宿舍，选了一个205。学校一个宿舍可以住几个人啊？男女可以混住的？
- 教师表中，英语选修9，英语2，1B模块总分，含义不明
- 东-高一，白-高一，白-高二，可以知道校区名字，其他不包含 东 ，白，字样的是哪个校区的？