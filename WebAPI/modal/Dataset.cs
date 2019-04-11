using Microsoft.AspNetCore.Hosting;
using System;
using System.Linq;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
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

    public static Dictionary<string, string> ExamTypeDic = new Dictionary<string, string>();

    public static List<MonthConsumptionStudent> StudentConsumptionList = new List<MonthConsumptionStudent>();

    public static List<GradeRank> ExamRankList = new List<GradeRank>();

    //数据库的导入
    public static void Load(IHostingEnvironment hostingEnvironment)
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
        }
        sr.Close();
        Console.WriteLine("读取考勤类型信息件数：" + KaoqinTypeDic.Count);
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

        //Dump(fullpath);
        if (true)
        {
            //读取成绩
            fullfilepath = fullpath + System.IO.Path.DirectorySeparatorChar + "ScoreRank.csv";
            ExamRankList.Clear();
            sr = new StreamReader(fullfilepath);
            sr.ReadLine();  //读取标题栏
            while (!sr.EndOfStream)
            {
                var line = sr.ReadLine().Split(",");
                ExamRankList.Add(new GradeRank()
                {
                    Id = line[0],
                    StudentID = line[1],
                    Rank = int.Parse(line[2]),
                    AvalibleCnt = int.Parse(line[3]),
                    //line[4]为年级排名比例
                    ClassRank = int.Parse(line[5])
                });
            }
            sr.Close();
            Console.WriteLine(timer.Elapsed.ToString());
        }

        Console.WriteLine("年级排行" + ExamRankList.Count);
        //使用Linq太慢，这里两个数组排序和直接赋值
        ChengjiList.Sort((x, y) => { return (x.Id + x.StudentID).CompareTo(y.Id + y.StudentID); });
        ExamRankList.Sort((x, y) => { return (x.Id + x.StudentID).CompareTo(y.Id + y.StudentID); });
        for (int i = 0; i < ChengjiList.Count; i++)
        {
            ChengjiList[i].Rank = ExamRankList[i].Rank;
            ChengjiList[i].AvalibleCnt = ExamRankList[i].AvalibleCnt;
            ChengjiList[i].ClassRank = ExamRankList[i].ClassRank;
        }
        //内存优化：2016-2017-1开始考试成绩保留，其他不要了
        ExamRankList.Clear();

        ChengjiList = ChengjiList.Where(x => x.Grade.StartsWith("高")).ToList();        //初中成绩
        Console.WriteLine("有效成绩数（高中）：" + ChengjiList.Count);
        Education.Controllers.CourseController.PrepareExamNameList();
        GC.Collect();

        //7选3
        foreach (var student in StudentList)
        {
            if (student.ClassName.Contains("高三"))
            {
                student.OptionCourse = Chengji.GetOptionCourse(student.ID);
                student.OptionCourse.Sort((x, y) => { return Chengji.OptionalSelectSort(x, y); });    //排序
            }
        }

        Console.WriteLine(timer.Elapsed.ToString());

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
        Console.WriteLine(timer.Elapsed.ToString());
        timer.Stop();
    }

    public static void Dump(string fullpath)
    {
        var timer = new System.Diagnostics.Stopwatch();
        timer.Start();

        StreamWriter sw;
        if (true)
        {
            sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "StudentConsumptionMonthList.csv");
            sw.WriteLine("Id,Name,Sex,ClassName,Month,Amount,LiveAtSchool");
            var MonthTitle = new string[] { "201807", "201808", "201809", "201810", "201811", "201812", "201901" };
            foreach (var student in Dataset.StudentList)
            {
                foreach (var mon in MonthTitle)
                {
                    var sum = Dataset.ConsumptionList.Where(x => x.DealYearMonth == mon && x.StudentID == student.ID).Sum(x => x.MonDeal);
                    sw.WriteLine(student.ID + "," + student.Name + "," + student.Sex + "," + student.ClassName + "," + mon + "," + sum + "," + student.LiveAtSchool);
                }
            }
            sw.Close();
            Console.WriteLine(timer.Elapsed.ToString());
        }

        //Rank
        var ExamUnion = ChengjiList.Select(x => x.IdForGradeExam).Distinct();
        //学期，考试类型，科目，年级 分组。获得排名
        var CntComplete = 0;

        Parallel.ForEach(ExamUnion, IdForGradeExam =>
        {
            var temp = ChengjiList.Where(x => x.IdForGradeExam == IdForGradeExam);
            var AvalibleCnt = temp.Count(x => x.Score > 0);
            foreach (var chengji in temp)
            {
                chengji.Rank = temp.Count(x => x.Score > chengji.Score) + 1;    //比这个成绩好的人数 + 1
                chengji.AvalibleCnt = AvalibleCnt;
            }
            CntComplete++;
            Console.WriteLine("Complete:[" + IdForGradeExam + "](" + CntComplete + "/" + ExamUnion.Count() + " OK)");
        });


        ExamUnion = ChengjiList.Select(x => x.IdForClass).Distinct();
        CntComplete = 0;
        Parallel.ForEach(ExamUnion, IdForClass =>
        {
            var temp = ChengjiList.Where(x => x.IdForClass == IdForClass);
            foreach (var chengji in temp)
            {
                chengji.ClassRank = temp.Count(x => x.Score > chengji.Score) + 1;    //比这个成绩好的人数 + 1
            }
            CntComplete++;
            Console.WriteLine("Complete:[" + IdForClass + "](" + CntComplete + "/" + ExamUnion.Count() + " OK)");
        });

        //DUMP CHENGJI
        sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "ScoreRank.csv");
        sw.WriteLine("Id,StudentID,Rank,AvalibleCnt,RankPercent,ClassRank");
        foreach (var item in Dataset.ChengjiList)
        {
            sw.WriteLine(item.Id + "," + item.StudentID + "," + item.Rank + "," + item.AvalibleCnt + "," + item.RankPercent + "," + item.ClassRank);
        }
        sw.Close();
        Console.WriteLine(timer.Elapsed.ToString());
        timer.Stop();
    }
}
