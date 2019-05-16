# Education

"数智教育"数据可视化创新大赛

运行环境

- Linux CentOS 7.4
- DotNet Core v3.0.0-preview5
- Angular 7.2.15

- UI ： Angular代码
- WebAPI：WebAPI代码
- netcore-web-example.service : NetCore WebAPI的CentOS守护进程
- nginx.conf : Nginx服务配置 UI和WebAPI都需要配置
  - /usr/local/nginx/conf
  - ./nginx 启动 (/usr/local/nginx/sbin)
  - ./nginx -s reload (/usr/local/nginx/sbin)
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

TODO:

0.总分的页面去掉教师和ID的表示
0.dialog-自响应必须改掉
1.页面间隔的问题，主要部分和次要部分
3.增加对比时候的人名
4.点中的记录如果有跳转，不变蓝色
6.增加跳转按钮
7.文档修改

- 高优先级
  - 学生对比画面雷达图
  - 学生成绩趋势图，增加一个按钮，弹出大图
  - 各种表格的排序问题，例如考试画面初始的时候没有按照班级进行排序

- 天气信息的活用，进行消费统计，进行考勤统计
- 寝室宿舍系的考虑：住宿学生的比例，同宿舍学生之间的关联等
- 教师按照课程进行统计（注意：通用技术和信息技术合并一下，英语选修9，英语2，1B模块总分过滤掉）
- 首页标签群：白杨，东部校区人数；住校人数；
- 首页增加数据件数的表示
- 关于天气：
    将天气分为上午和下午。如果没有破折号，则认为上下午都是一样的。  
    注意：转 也是一个区分符号。
- 宿舍视图
  
- 低优先度
  - 背景粒子效果 particles.js
  - 弹出框背景透明度设定

[官方答疑帖--0423更新](https://tianchi.aliyun.com/forum/postDetail?spm=5176.12586969.1002.3.2c9f6553QiG4t2&postId=53529)

界面示意图：

![Aaron Swartz](/界面变迁图/首页20190404.png)
![Aaron Swartz](/界面变迁图/考勤20190404.png)
![Aaron Swartz](/界面变迁图/考试20190404.png)
![Aaron Swartz](/界面变迁图/个人成绩趋势.png)