using Microsoft.AspNetCore.Hosting;
using System;
using System.Linq;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using Education.Controllers;
using static Education.Controllers.ClassController;
using static Utility;
using Newtonsoft.Json;

public static class Dataset
{
    /// <summary>
    /// 数据库路径
    /// </summary>
    public static readonly string datasetPath = "education_data";

    public static readonly Char QMark = (char)34;

    public static List<Weather> WeatherList = new List<Weather>();

    public static List<Teacher> TeacherList = new List<Teacher>();

    public static List<Student> StudentList = new List<Student>();

    public static List<Kaoqin> KaoqinList = new List<Kaoqin>();

    public static List<Chengji> ChengjiList = new List<Chengji>();

    public static List<Consumption> ConsumptionList = new List<Consumption>();

    public static Dictionary<string, struKaoqin> KaoqinTypeDic = new Dictionary<string, struKaoqin>();

    public static Dictionary<string, struKaoqin> KaoqinTypeDic2018 = new Dictionary<string, struKaoqin>();


    public static Dictionary<string, string> ExamTypeDic = new Dictionary<string, string>();

    public static List<MonthConsumptionStudent> StudentConsumptionList = new List<MonthConsumptionStudent>();

    public static List<MonthConsumptionStudent> StudentWeeklyConsumptionList = new List<MonthConsumptionStudent>();


    public static List<ClassBaseInfo> classBaseInfoList = new List<ClassBaseInfo>();

    public static List<NameValueSet> NoConsumptionList = new List<NameValueSet>();

    public static Dictionary<string, int> KaoqinStudentIdDetail = new Dictionary<string, int>();

    //数据库的导入
    public static void Load(IWebHostEnvironment hostingEnvironment)
    {
        var fullpath = hostingEnvironment.ContentRootPath + System.IO.Path.DirectorySeparatorChar + datasetPath;
        Console.WriteLine("数据库路径:" + fullpath);
        var timer = new System.Diagnostics.Stopwatch();
        timer.Start();

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
        Education.Controllers.KaoqinController.PrepareKaoqinOverview();
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
        CreateTotalScoreForGrade3(fullpath);
        Console.WriteLine("有效成绩数（含7选3）：" + ChengjiList.Count);
        Console.WriteLine(timer.Elapsed.ToString());
        Education.Controllers.CourseController.PrepareExamNameList();
        GC.Collect();

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
        //全体消费信息预先统计
        Education.Controllers.ConsumptionController.PrepareSchoolConsumptionInfo();
        Console.WriteLine("全体消费信息预先统计");
        Console.WriteLine(timer.Elapsed.ToString());

        fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "StudentConsumptionMonthList.csv";
        sr = new StreamReader(fullfilepath);
        sr.ReadLine();  //读取标题栏
        while (!sr.EndOfStream)
        {
            var line = sr.ReadLine().Split(",");
            StudentConsumptionList.Add(new MonthConsumptionStudent()
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
        timer.Stop();
    }

    public static void CreatePresentStudentList(string fullpath)
    {
        //假设如果该天出勤，就应该有至少一条消费记录
        var sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "PresentStudentList.csv");
        sw.WriteLine("studentId,date");

        foreach (var student in Dataset.StudentList)
        {
            //如果该学生没有任何一条消费记录，则跳过
            if (ConsumptionList.Count(x => x.StudentID == student.ID) == 0) continue;

            foreach (var workday in Utility.WorkDays)
            {
                if (ConsumptionList.Count(x => x.StudentID == student.ID &&
                   (x.DealTimeYear + x.DealTimeMonth + x.DealTimeDay).Equals(workday)) == 0)
                {
                    sw.WriteLine(student.ID + "," + workday);
                }

            }
        }
        sw.Close();
    }

    public static void CreateTeacherRelationShipJsonFile(string fullpath)
    {
        var Grade3 = new { name = "高三", children = GetTeacherNode("高三") };
        var Grade2 = new { name = "高二", children = GetTeacherNode("高二") };
        var Grade1BaiYang = new { name = "高一白杨", children = GetTeacherNode("白-高一") };
        var Grade1East = new { name = "高一东部", children = GetTeacherNode("东-高一") };
        var Grade1 = new { name = "高一", children = new List<dynamic> { Grade1East, Grade1BaiYang } };
        var School = new { name = "实效中学", children = new List<dynamic> { Grade1, Grade2, Grade3 } };
        var json = JsonConvert.SerializeObject(School);
        var sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "Teacher.json");
        sw.WriteLine(json);
        sw.Close();
    }

    private static dynamic GetTeacherNode(string grade)
    {
        var LastTermTeacher = Dataset.TeacherList.Where(x => x.Term == "2018-2019-1").ToList();
        //高三教师的提取
        var TeacherGrade3 = LastTermTeacher.Where(x => x.ClassName.Contains(grade));
        var SubNameGrade3 = TeacherGrade3.Select(x => x.SubName).Distinct().ToList();
        //课程子节点的做成
        var SubNodeGrade3List = new List<dynamic>();
        foreach (var subname in SubNameGrade3)
        {
            var teachers = TeacherGrade3.Where(x => x.SubName == subname).Distinct(new Teacher()).ToList();
            var TeacherClassList = new List<dynamic>();
            foreach (var teacher in teachers)
            {
                TeacherClassList.Add(new
                {
                    name = teacher.Name,
                    children = TeacherGrade3.Where(x => x.Id == teacher.Id).Select(x => { return new { name = x.ClassName }; }).ToList()
                });
            }
            //获得所有教师和班级联系
            SubNodeGrade3List.Add(new { name = subname, children = TeacherClassList });
        }
        return SubNodeGrade3List;
    }


    /// <summary>
    /// 高三选修课
    /// </summary>
    /// <param name="fullpath"></param>
    public static void CreateTotalScoreForGrade3(string fullpath)
    {
        var TotalScoreList_FiveSchool = new List<Chengji>();
        var ClassDict = new Dictionary<String, int>();

        //高三学生五校联考
        foreach (var student in Dataset.StudentList)
        {
            if (student.OptionCourse_FiveSchool != null &&
                student.OptionCourse_FiveSchool.Count == 3)
            {
                var Temp = ChengjiList.Where(x => x.Type == "6" &&
                student.OptionCourse_FiveSchool.Contains(x.SubName) &&
                x.StudentID == student.ID);
                var Sum = Temp.Sum(x => x.Score > 0 ? x.Score : 0);
                var Number = Temp.First().Number;
                var NumberName = Temp.First().NumberName;
                var ClassKey = String.Join("/", student.OptionCourse_FiveSchool);
                var ClassValue = 0;
                if (ClassDict.ContainsKey(ClassKey))
                {
                    ClassValue = ClassDict[ClassKey];
                }
                else
                {
                    ClassValue = ClassDict.Count + 1;
                    ClassDict.Add(ClassKey, ClassValue);
                }
                TotalScoreList_FiveSchool.Add(new Chengji()
                {
                    //Rank将999999采番用掉了，这里从000001开始采番
                    Id = "000001",
                    Number = Number,
                    StudentID = student.ID,
                    Score = Sum,
                    StudentName = student.Name,
                    ClassID = ClassValue.ToString("D3"),
                    ClassName = ClassKey,
                    NumberName = NumberName,
                    Term = "2018-2019-1",
                    Grade = "高三",
                    Type = "6",
                    FullScore = 300
                });
            }
        }

        //高三学生十校联考
        var TotalScoreList_TenSchool = new List<Chengji>();
        foreach (var student in Dataset.StudentList)
        {
            if (student.OptionCourse_TenSchool != null &&
                student.OptionCourse_TenSchool.Count == 3)
            {
                var Temp = ChengjiList.Where(x => x.Type == "7" &&
                student.OptionCourse_TenSchool.Contains(x.SubName) &&
                x.StudentID == student.ID);
                var Sum = Temp.Sum(x => x.Score > 0 ? x.Score : 0);
                var Number = Temp.First().Number;
                var NumberName = Temp.First().NumberName;
                var ClassKey = String.Join("/", student.OptionCourse_FiveSchool);
                var ClassValue = 0;
                if (ClassDict.ContainsKey(ClassKey))
                {
                    ClassValue = ClassDict[ClassKey];
                }
                else
                {
                    ClassValue = ClassDict.Count + 1;
                    ClassDict.Add(ClassKey, ClassValue);
                }
                TotalScoreList_TenSchool.Add(new Chengji()
                {
                    //Rank将999999采番用掉了，这里从000001开始采番
                    Id = "000002",
                    Number = Number,
                    StudentID = student.ID,
                    Score = Sum,
                    StudentName = student.Name,
                    ClassID = ClassValue.ToString("D3"),
                    ClassName = ClassKey,
                    NumberName = NumberName,
                    Term = "2018-2019-1",
                    Grade = "高三",
                    Type = "7",
                    FullScore = 300
                });
            }
        }

        //总分表
        //var sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "TotalScoreForGrade3.csv");
        //获得考试数：Number做Distinct
        //sw.WriteLine("Number,StudentId,Score,GradeRank,StudentName,ClassID,ClassName,Grade,Term,NumberName,FullScore,Type");
        float TenAvg = TotalScoreList_TenSchool.Average(x => x.Score);
        foreach (var chengji in TotalScoreList_TenSchool)
        {
            chengji.SubId = "98";
            chengji.SubName = "7选3";
            chengji.GradeRank = TotalScoreList_TenSchool.Count(x => x.Score > chengji.Score) + 1;
            chengji.GradeAvg = TenAvg;
            chengji.GradeAvalibleCnt = TotalScoreList_TenSchool.Count;

            chengji.ClassRank = TotalScoreList_TenSchool.Count(x => x.Score > chengji.Score && x.ClassID == chengji.ClassID) + 1;
            chengji.ClassAvg = TotalScoreList_TenSchool.Where(x => x.ClassID == chengji.ClassID).Average(x => x.Score);
            chengji.ClassAvalibleCnt = TotalScoreList_TenSchool.Count(x => x.ClassID == chengji.ClassID);

            Dataset.ChengjiList.Add(chengji);

            //sw.WriteLine(chengji.Number + "," + chengji.StudentID + "," + chengji.Score + "," + chengji.GradeRank + "," +
            //           chengji.StudentName + "," + chengji.ClassID + "," + chengji.ClassName + "," +
            //           chengji.Grade + "," + chengji.Term + "," + chengji.NumberName + "," + chengji.FullScore + "," + chengji.Type);

        }

        float FiveAvg = TotalScoreList_FiveSchool.Average(x => x.Score);
        foreach (var chengji in TotalScoreList_FiveSchool)
        {
            chengji.SubId = "98";
            chengji.SubName = "7选3";
            chengji.GradeRank = TotalScoreList_FiveSchool.Count(x => x.Score > chengji.Score) + 1;
            chengji.GradeAvg = FiveAvg;
            chengji.GradeAvalibleCnt = TotalScoreList_FiveSchool.Count;

            chengji.ClassRank = TotalScoreList_FiveSchool.Count(x => x.Score > chengji.Score && x.ClassID == chengji.ClassID) + 1;
            chengji.ClassAvg = TotalScoreList_FiveSchool.Where(x => x.ClassID == chengji.ClassID).Average(x => x.Score);
            chengji.ClassAvalibleCnt = TotalScoreList_FiveSchool.Count(x => x.ClassID == chengji.ClassID);

            Dataset.ChengjiList.Add(chengji);

            //sw.WriteLine(chengji.Number + "," + chengji.StudentID + "," + chengji.Score + "," + chengji.GradeRank + "," +
            //           chengji.StudentName + "," + chengji.ClassID + "," + chengji.ClassName + "," +
            //           chengji.Grade + "," + chengji.Term + "," + chengji.NumberName + "," + chengji.FullScore + "," + chengji.Type);

        }

        //sw.Close();
    }


    public static void CreateTotalScore(string fullpath)
    {
        StreamWriter sw;
        var CntComplete = 0;

        var TotalScoreList = new ConcurrentBag<Chengji>();
        var NumberUnion = ChengjiList.Select(x => x.Number).Distinct();
        Parallel.ForEach(NumberUnion, ExamNumber =>
        {
            //参加该次考试的学生ID列表
            var StudentIds = ChengjiList.Where(x => x.Number == ExamNumber).Select(x => x.StudentID).Distinct();
            Parallel.ForEach(StudentIds, StudentID =>
            {
                var Temp = ChengjiList.Where(x => x.Number == ExamNumber && x.StudentID == StudentID);
                var Sum = Temp.Sum(x => x.Score > 0 ? x.Score : 0);
                var student = Dataset.StudentList.Where(x => x.ID == StudentID).First();
                //每次考试可能每个人考试内容都不同，所以这里还是按照人来计算,只统计参加了考试的分数
                var FullScore = Temp.Sum(x => x.Score > 0 ? x.FullScore : 0);
                TotalScoreList.Add(new Chengji()
                {
                    Number = ExamNumber,
                    StudentID = StudentID,
                    Score = Sum,
                    StudentName = student.Name,
                    ClassID = student.ClassId,
                    ClassName = student.ClassName,
                    NumberName = Temp.First().NumberName,
                    Term = Temp.First().Term,
                    Grade = Temp.First().Grade,
                    Type = Temp.First().Type,
                    FullScore = FullScore
                });
            });
            CntComplete++;
            Console.WriteLine("Complete:[" + ExamNumber + "](" + CntComplete + "/" + NumberUnion.Count() + " OK)");
        });

        //总分表
        sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "TotalScore.csv");
        //获得考试数：Number做Distinct
        sw.WriteLine("Number,StudentId,Score,GradeRank,StudentName,ClassID,ClassName,Grade,Term,NumberName,FullScore,Type");
        var GradeList = new string[] { "高一", "高二", "高三" };
        foreach (var ExamNumber in NumberUnion)
        {
            foreach (var Grade in GradeList)
            {
                var temp = TotalScoreList.Where(x => x.Number == ExamNumber && x.Grade == Grade);
                foreach (var chengji in temp)
                {
                    chengji.GradeRank = temp.Count(x => x.Score > chengji.Score) + 1;
                    chengji.SubId = "99";
                    sw.WriteLine(chengji.Number + "," + chengji.StudentID + "," + chengji.Score + "," + chengji.GradeRank + "," +
                                 chengji.StudentName + "," + chengji.ClassID + "," + chengji.ClassName + "," +
                                 chengji.Grade + "," + chengji.Term + "," + chengji.NumberName + "," + chengji.FullScore + "," + chengji.Type);

                }
            }
        }
        sw.Close();
    }



    public static void CreateRank(string fullpath)
    {
        var timer = new System.Diagnostics.Stopwatch();
        timer.Start();

        StreamWriter sw;
        var CntComplete = 0;
        //Rank
        var ExamUnion = ChengjiList.Select(x => x.IdForGradeExam).Distinct();
        //学期，考试类型，科目，年级 分组,获得排名
        CntComplete = 0;
        Parallel.ForEach(ExamUnion, IdForGradeExam =>
        {
            var temp = ChengjiList.Where(x => x.IdForGradeExam == IdForGradeExam);
            var AvalibleCnt = temp.Count(x => x.Score > 0);
            var avg = AvalibleCnt == 0 ? 0 : temp.Where(x => x.Score > 0).Average(x => x.Score);
            foreach (var chengji in temp)
            {
                chengji.GradeRank = temp.Count(x => x.Score > chengji.Score) + 1;    //比这个成绩好的人数 + 1
                chengji.GradeAvalibleCnt = AvalibleCnt;
                chengji.GradeAvg = avg;
            }
            CntComplete++;
            Console.WriteLine("Complete:[" + IdForGradeExam + "](" + CntComplete + "/" + ExamUnion.Count() + " OK)");
        });


        ExamUnion = ChengjiList.Select(x => x.IdForClass).Distinct();
        CntComplete = 0;
        Parallel.ForEach(ExamUnion, IdForClass =>
        {
            var temp = ChengjiList.Where(x => x.IdForClass == IdForClass);
            var AvalibleCnt = temp.Count(x => x.Score > 0);
            var avg = AvalibleCnt == 0 ? 0 : temp.Where(x => x.Score > 0).Average(x => x.Score);
            foreach (var chengji in temp)
            {
                chengji.ClassRank = temp.Count(x => x.Score > chengji.Score) + 1;    //比这个成绩好的人数 + 1
                chengji.ClassAvalibleCnt = AvalibleCnt;
                chengji.ClassAvg = avg;
            }
            CntComplete++;
            Console.WriteLine("Complete:[" + IdForClass + "](" + CntComplete + "/" + ExamUnion.Count() + " OK)");
        });

        //DUMP CHENGJI
        sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "ScoreRank.csv");
        sw.WriteLine("Id,StudentID,GradeAvalibleCnt,ClassAvalibleCnt,GradeRank,ClassRank,GradeAvg,ClassAvg");
        foreach (var item in Dataset.ChengjiList)
        {
            sw.WriteLine(item.Id + "," + item.StudentID + "," + item.GradeAvalibleCnt + "," +
            item.ClassAvalibleCnt + "," + item.GradeRank + "," + item.ClassRank + "," + item.GradeAvg + "," +
            item.ClassAvg);
        }
        sw.Close();
        Console.WriteLine(timer.Elapsed.ToString());
        timer.Stop();
    }

    public static void CreateMonthlyConsumption(string fullpath)
    {
        StreamWriter sw;
        var CntComplete = 0;
        //月度消费
        sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "StudentConsumptionMonthList.csv");
        sw.WriteLine("Id,Name,Sex,ClassName,Month,Amount,LiveAtSchool");
        var MonthTitle = new string[] { "201807", "201808", "201809", "201810", "201811", "201812", "201901" };
        foreach (var student in Dataset.StudentList)
        {
            foreach (var mon in MonthTitle)
            {
                var sum = Dataset.ConsumptionList.Where(x => x.DealYearMonth == mon && x.StudentID == student.ID).Sum(x => x.MonDeal);
                sw.WriteLine(student.ID + "," + student.Name + "," + student.Sex + "," + student.ClassName + "," + mon + "," + sum + "," + student.LiveAtSchool);
                CntComplete++;
            }
        }
        sw.Close();
    }

    public static void CreateWeeklyConsumption(string fullpath)
    {
        StreamWriter sw;
        var CntComplete = 0;
        //月度消费
        sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "StudentConsumptionWeekList.csv");
        sw.WriteLine("Id,Name,Sex,ClassName,WeekDayNames,Amount,LiveAtSchool");
        var WeekDays = new DayOfWeek[] { DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday, DayOfWeek.Sunday };
        var WeekDayNames = new String[] { "周一", "周二", "周三", "周四", "周五", "周六", "周日" };
        foreach (var student in Dataset.StudentList)
        {
            for (int i = 0; i < 7; i++)
            {
                var weekday = WeekDays[i];
                var sum = Dataset.ConsumptionList.Where(x => x.DayOfWeek == weekday && x.StudentID == student.ID).Sum(x => x.MonDeal);
                sw.WriteLine(student.ID + "," + student.Name + "," + student.Sex + "," + student.ClassName + "," + WeekDayNames[i] + "," + sum + "," + student.LiveAtSchool);
                CntComplete++;
            }
        }
        sw.Close();
    }

}
