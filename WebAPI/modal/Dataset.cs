using Microsoft.AspNetCore.Hosting;
using System;
using System.Linq;
using System.IO;
using System.Collections.Generic;
using static Education.Controllers.ClassController;
using static Utility;

public static class Dataset
{
    /// <summary>
    /// 数据库路径
    /// </summary>
    public static readonly string datasetPath = "education_data";

    public static readonly Char QMark = (char)34;

    public static List<Weather> WeatherList = new List<Weather>();

    public static List<AIFeature> AIFeatureList = new List<AIFeature>();

    public static List<Teacher> TeacherList = new List<Teacher>();

    public static List<Student> StudentList = new List<Student>();

    public static List<Kaoqin> KaoqinList = new List<Kaoqin>();

    public static List<Chengji> ChengjiList = new List<Chengji>();

    public static List<Consumption> ConsumptionList = new List<Consumption>();

    public static Dictionary<string, struKaoqin> KaoqinTypeDic = new Dictionary<string, struKaoqin>();

    public static Dictionary<string, struKaoqin> KaoqinTypeDic2018 = new Dictionary<string, struKaoqin>();


    public static Dictionary<string, string> ExamTypeDic = new Dictionary<string, string>();

    public static List<MonthConsumptionStudent> StudentMonthlyConsumptionList = new List<MonthConsumptionStudent>();

    public static List<MonthConsumptionStudent> StudentWeeklyConsumptionList = new List<MonthConsumptionStudent>();

    public static Dictionary<string, MonthConsumptionStudent> ConsumptionDict = new Dictionary<string, MonthConsumptionStudent>();

    public static List<ClassBaseInfo> classBaseInfoList = new List<ClassBaseInfo>();

    public static List<NameValueSet> NoConsumptionList = new List<NameValueSet>();

    public static Dictionary<string, int> KaoqinStudentIdDetail = new Dictionary<string, int>();

    public static List<NameValueSet> Minute_00000 = new List<NameValueSet>();
    public static List<NameValueSet> Minute_99001 = new List<NameValueSet>();
    public static List<NameValueSet> Minute_99002 = new List<NameValueSet>();
    public static List<NameValueSet> Minute_99003 = new List<NameValueSet>();
    public static List<NameValueSet> Minute_99004 = new List<NameValueSet>();
    public static List<NameValueSet> Minute_99005 = new List<NameValueSet>();

    //数据库的导入
    public static void Load(IWebHostEnvironment hostingEnvironment)
    {
        var fullpath = hostingEnvironment.ContentRootPath + System.IO.Path.DirectorySeparatorChar + datasetPath;
        Console.WriteLine("数据库路径:" + fullpath);
        var timer = new System.Diagnostics.Stopwatch();
        timer.Start();
        Console.WriteLine("内存变化:" + GC.GetTotalMemory(true));

        //导入教师信息 5_chengji.csv
        var fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "1_teacher.csv";
        var sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        TeacherList.Clear();
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine();
            TeacherList.Add(new Teacher(line));
        }
        sr.Close();
        Console.WriteLine("读取教师信息件数：" + TeacherList.Count);
        Console.WriteLine(timer.Elapsed.ToString());

        //导入教师信息 5_chengji.csv
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "pred_dengdi.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        AIFeatureList.Clear();
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine();
            AIFeatureList.Add(new AIFeature(line));
        }
        sr.Close();
        Console.WriteLine("读取ML信息件数：" + AIFeatureList.Count);
        Console.WriteLine(timer.Elapsed.ToString());


        //导入天气基本信息 宁波历史天气数据.csv
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "宁波历史天气数据.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        WeatherList.Clear();
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine();
            WeatherList.Add(new Weather(line));
        }
        sr.Close();
        Console.WriteLine("读取天气基本信息件数：" + WeatherList.Count);
        Console.WriteLine(timer.Elapsed.ToString());

        //导入学生基本信息 2_student_info.csv
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "2_student_info.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        StudentList.Clear();
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine();
            StudentList.Add(new Student(line));
        }
        sr.Close();
        StudentList.Sort((x, y) => x.ID.CompareTo(y.ID));
        Console.WriteLine("读取学生基本信息件数：" + StudentList.Count);
        Console.WriteLine(timer.Elapsed.ToString());
        var ClassCntDict = new Dictionary<String, int>();
        foreach (var stud in StudentList)
        {
            if (!ClassCntDict.ContainsKey(stud.ClassId + stud.ClassName))
            {
                ClassCntDict.Add(stud.ClassId + stud.ClassName, 0);
            }
            ClassCntDict[stud.ClassId + stud.ClassName]++;
        }
        foreach (var key in ClassCntDict.Keys)
        {
            classBaseInfoList.Add(new ClassBaseInfo()
            {
                label = key.Substring(3),
                value = key.Substring(0, 3),
                count = ClassCntDict[key]
            });
        }
        Console.WriteLine("内存变化:" + GC.GetTotalMemory(true));

        //导入考勤类型信息 4_kaoqintype.csv
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "4_kaoqintype.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        KaoqinTypeDic.Clear();
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine();
            var x = new struKaoqin(line);
            KaoqinTypeDic.Add(x.control_task_order_id, x);
            if (x.controler_id.StartsWith("009"))
            {
                KaoqinTypeDic2018.Add(x.control_task_order_id, x);
            }
        }
        sr.Close();
        Console.WriteLine("读取考勤类型信息件数：" + KaoqinTypeDic.Count);
        Console.WriteLine("2018学期读取考勤类型信息件数：" + KaoqinTypeDic2018.Count);
        Console.WriteLine(timer.Elapsed.ToString());

        //导入考勤信息 3_kaoqin.csv
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "3_kaoqin.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        KaoqinList.Clear();
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine();
            KaoqinList.Add(new Kaoqin(line));
        }
        sr.Close();
        Console.WriteLine("读取考勤信息件数：" + KaoqinList.Count);
        Console.WriteLine(timer.Elapsed.ToString());

        foreach (var student in StudentList)
        {
            foreach (var key in KaoqinTypeDic2018.Keys)
            {
                var cnt = Dataset.KaoqinList.Count(x => x.StudentID == student.ID && x.DetailId == key);
                KaoqinStudentIdDetail.Add(student.ID + key, cnt);
            }
        }
        //导入学生成绩信息 5_chengji.csv
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "5_chengji.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        ChengjiList.Clear();
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine();
            ChengjiList.Add(new Chengji(line));
        }
        sr.Close();
        Console.WriteLine("读取学生成绩信息件数：" + ChengjiList.Count);
        Console.WriteLine(timer.Elapsed.ToString());

        ChengjiList = ChengjiList.Where(x => !String.IsNullOrEmpty(x.ClassID)).ToList();        //无法找到班级的，也就是学生表中不存在的学生
        ChengjiList = ChengjiList.Where(x => x.Term.CompareTo("2016-2017-1") >= 0).ToList();    //2016学年之前的课程
        ChengjiList = ChengjiList.Where(x => !String.IsNullOrEmpty(x.SubName)).ToList();        //无科目的课程
        Console.WriteLine("有效成绩数：" + ChengjiList.Count);
        ChengjiList = ChengjiList.Where(x => x.Grade.StartsWith("高")).ToList();                //初中成绩
        Console.WriteLine("有效成绩数（高中）：" + ChengjiList.Count);

        //相同Number，相同课程，有多条记录的情况,一般是因为缺考的补考造成的，这里使用补考成绩作为统计数据
        var CheckPoint = ChengjiList.GroupBy(x => x.Number + x.SubId + x.StudentID).Where(x => x.Count() > 1).Select(x => x.ToList());
        foreach (var item in CheckPoint)
        {
            //去掉其中较小的一个成绩
            if (item[0].Score > item[1].Score)
            {
                //Console.WriteLine(item[1].Score);
                ChengjiList.Remove(item[1]);
            }
            else
            {
                //Console.WriteLine(item[0].Score);
                ChengjiList.Remove(item[0]);
            }
        }
        Console.WriteLine("有效成绩数（去重复数据）：" + ChengjiList.Count);
        //CreateTotalScore(fullpath);
        //读取总分
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "TotalScore.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        var NewExamId = 999000;
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine().Split(",");
            ChengjiList.Add(new Chengji()
            {
                Number = line[0],
                StudentID = line[1],
                Score = float.Parse(line[2]),
                GradeRank = int.Parse(line[3]),
                StudentName = line[4],
                ClassID = line[5],
                ClassName = line[6],
                Grade = line[7],
                Term = line[8],
                NumberName = line[9],
                FullScore = float.Parse(line[10]),
                Type = line[11],
                SubId = "99",
                SubName = "总分",
                Id = NewExamId.ToString(),
                IdForGradeExam = "99" + ":" + line[0] + ":" + line[7]
            });
            NewExamId++;
        }
        sr.Close();
        Console.WriteLine("有效成绩数（含总分）：" + ChengjiList.Count);

        //CreateRank(fullpath);
        //读取排名
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "ScoreRank.csv";
        var ExamRankList = new List<AddtionalInfo>();
        ExamRankList.Clear();
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine().Split(",");
            ExamRankList.Add(new AddtionalInfo()
            {
                Id = line[0],
                StudentID = line[1],
                GradeAvalibleCnt = int.Parse(line[2]),
                ClassAvalibleCnt = int.Parse(line[3]),
                GradeRank = int.Parse(line[4]),
                ClassRank = int.Parse(line[5]),
                GradeAvg = float.Parse(line[6]),
                ClassAvg = float.Parse(line[7])
            });
        }
        sr.Close();

        Console.WriteLine("年级排行" + ExamRankList.Count);
        //使用Linq太慢，这里两个数组排序和直接赋值
        ChengjiList.Sort((x, y) => { return (x.Id + x.StudentID).CompareTo(y.Id + y.StudentID); });
        ExamRankList.Sort((x, y) => { return (x.Id + x.StudentID).CompareTo(y.Id + y.StudentID); });
        for (int i = 0; i < ChengjiList.Count; i++)
        {
            ChengjiList[i].GradeRank = ExamRankList[i].GradeRank;
            ChengjiList[i].ClassRank = ExamRankList[i].ClassRank;
            ChengjiList[i].GradeAvalibleCnt = ExamRankList[i].GradeAvalibleCnt;
            ChengjiList[i].ClassAvalibleCnt = ExamRankList[i].ClassAvalibleCnt;
            ChengjiList[i].GradeAvg = ExamRankList[i].GradeAvg;
            ChengjiList[i].ClassAvg = ExamRankList[i].ClassAvg;
        }
        //内存优化：2016-2017-1开始考试成绩保留，其他不要了
        ExamRankList.Clear();
        Console.WriteLine(timer.Elapsed.ToString());

        //7选3
        foreach (var student in StudentList)
        {
            if (student.ClassName.Contains("高三"))
            {
                student.OptionCourse_FiveSchool = Chengji.GetOptionCourse(student.ID, "6");
                student.OptionCourse_FiveSchool.Sort((x, y) => { return Chengji.OptionalSelectSort(x, y); });

                student.OptionCourse_TenSchool = Chengji.GetOptionCourse(student.ID, "7");
                student.OptionCourse_TenSchool.Sort((x, y) => { return Chengji.OptionalSelectSort(x, y); });
                //默认值
                student.OptionCourse = Chengji.GetOptionCourse(student.ID, "6");
                student.OptionCourse.Sort((x, y) => { return Chengji.OptionalSelectSort(x, y); });
            }
        }
        Console.WriteLine(timer.Elapsed.ToString());
        CreateCahceFile.CreateTotalScoreForGrade3();
        Console.WriteLine("有效成绩数（含7选3）：" + ChengjiList.Count);
        Console.WriteLine(timer.Elapsed.ToString());
        Education.Controllers.CourseController.PrepareExamNameList();
        GC.Collect();
        Console.WriteLine("内存变化:" + GC.GetTotalMemory(true));

        //导入考试类型信息 6_exam_type.csv
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "6_exam_type.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        ExamTypeDic.Clear();
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine().Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray(); ;
            ExamTypeDic.Add(line[0], line[1]);
        }
        //ExamTypeDic.Add("99", "总分");
        sr.Close();
        Console.WriteLine("读取考试类型信息件数：" + ExamTypeDic.Count);
        Console.WriteLine(timer.Elapsed.ToString());

        //导入学生消费信息 7_consumption
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "7_consumption.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        ConsumptionList.Clear();
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine();
            ConsumptionList.Add(new Consumption(line));
        }
        sr.Close();
        Console.WriteLine("读取学生消费件数：" + ConsumptionList.Count);

        //CreateWeeklyConsumption(fullpath);
        //Dump(fullpath);
        Console.WriteLine("全体消费信息预先统计");
        Console.WriteLine(timer.Elapsed.ToString());

        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "StudentConsumptionMonthList.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine().Split(",");
            StudentMonthlyConsumptionList.Add(new MonthConsumptionStudent()
            {
                ID = line[0],
                Name = line[1],
                Sex = line[2],
                ClassName = line[3],
                Month = line[4],
                Amount = -1 * float.Parse(line[5]),
                LiveAtSchool = line[6] == "True"
            });
        }
        sr.Close();

        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "StudentConsumptionWeekList.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine().Split(",");
            StudentWeeklyConsumptionList.Add(new MonthConsumptionStudent()
            {
                ID = line[0],
                Name = line[1],
                Sex = line[2],
                ClassName = line[3],
                Month = line[4],
                Amount = -1 * float.Parse(line[5]),
                LiveAtSchool = line[6] == "True"
            });
        }
        sr.Close();

        Console.WriteLine("内存变化:" + GC.GetTotalMemory(true));

        foreach (var item in StudentMonthlyConsumptionList)
        {
            ConsumptionDict.Add(item.ID + item.Month, item);
        }
        foreach (var item in StudentWeeklyConsumptionList)
        {
            ConsumptionDict.Add(item.ID + item.Month, item);
        }
        long n2 = GC.GetTotalMemory(true);
        Console.WriteLine("内存变化:" + GC.GetTotalMemory(true));

        Console.WriteLine(timer.Elapsed.ToString());
        //var t = Utility.GetTotalDaysCnt();
        //CreatePresentStudentList(fullpath);
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "PresentStudentList.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine().Split(",");
            NoConsumptionList.Add(new NameValueSet()
            {
                name = line[0],
                value = int.Parse(line[1])
            });
        }
        sr.Close();
        Console.WriteLine(timer.Elapsed.ToString());
        //读取分钟文件
        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "HourMinuteRec.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine().Split(",");
            var key = line[1];
            var minute = line[0];
            var count = int.Parse(line[2]);
            switch (key)
            {
                case "99001":
                    Minute_99001.Add(new NameValueSet() { name = minute, value = count });
                    break;
                case "99002":
                    Minute_99002.Add(new NameValueSet() { name = minute, value = count });
                    break;
                case "99003":
                    Minute_99003.Add(new NameValueSet() { name = minute, value = count });
                    break;
                case "99004":
                    Minute_99004.Add(new NameValueSet() { name = minute, value = count });
                    break;
                case "99005":
                    Minute_99005.Add(new NameValueSet() { name = minute, value = count });
                    break;
                case "00000":
                    Minute_00000.Add(new NameValueSet() { name = minute, value = count });
                    break;
                default:
                    break;
            }
        }
        sr.Close();
        //全体消费信息预先统计
        Education.Controllers.ConsumptionController.PrepareSchoolConsumptionInfo();
        Education.Controllers.KaoqinController.PrepareKaoqinOverview();
        Console.WriteLine(timer.Elapsed.ToString());
        timer.Stop();
    }
}
