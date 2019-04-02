using Microsoft.AspNetCore.Hosting;
using System;
using System.Linq;
using System.IO;
using System.Collections.Generic;
using static Chengji;

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

    public static List<Chengji> LastestTermChangji = new List<Chengji>();

    public static List<Consumption> ConsumptionList = new List<Consumption>();

    public static Dictionary<string, struKaoqin> KaoqinTypeDic = new Dictionary<string, struKaoqin>();

    public static Dictionary<string, string> ExamTypeDic = new Dictionary<string, string>();

    public static List<MonthConsumptionStudent> StudentConsumptionList = new List<MonthConsumptionStudent>();

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
        ChengjiList.Clear();
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
        foreach (var student in StudentList)
        {
            //选修课
            if (student.ClassName.Contains("高三"))
            {
                student.OptionCourse = Dataset.GetOptionCourse(student.ID);
                student.OptionCourse.Sort((x, y) => { return Chengji.OptionalSelectSort(x, y); });    //排序
            }
        }
        LastestTermChangji = Dataset.ChengjiList.Distinct(new Chengji()).Where(x => x.Term == "2018-2019-1").ToList();


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
        //全体消费信息预先统计
        Education.Controllers.ConsumptionController.PrepareSchoolConsumptionInfo();
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
                Amount = -1 * float.Parse(line[5])
            });
        }
        sr.Close();
        Console.WriteLine(timer.Elapsed.ToString());
        /* var sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "StudentConsumptionMonthList.csv");
        sw.WriteLine("Id,Name,Sex,ClassName,Month,Amount");
        var MonthTitle = new string[] { "201807", "201808", "201809", "201810", "201811", "201812", "201901" };
        foreach (var student in Dataset.StudentList)
        {
            foreach (var mon in MonthTitle)
            {
                var sum = Dataset.ConsumptionList.Where(x => x.DealYearMonth == mon && x.StudentID == student.ID).Sum(x => x.MonDeal);
                sw.WriteLine(student.ID + "," + student.Name + "," + student.Sex + "," +  student.ClassName + "," + mon + "," + sum );
            }
        }
        sw.Close(); 
        Console.WriteLine(timer.Elapsed.ToString());*/

        //DUMP CHENGJI
        /* var sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "5_chengji_dump.csv");
        sw.WriteLine("Id,IdForClass,NumberName,Grade,ClassID,ClassName,Term,StudentID,subName");
        foreach (var item in Dataset.ChengjiList)
        {
            sw.WriteLine(item.Id + "," + item.IdForClass + "," + item.NumberName + "," + item.Grade + "," + item.ClassID + "," + item.ClassName + "," +
                         item.Term + "," + item.StudentID + "," + item.SubName);
        }
        sw.Close(); */
        //Console.WriteLine(timer.Elapsed.ToString());
        timer.Stop();
    }

    /// <summary>
    /// 通过学号获得选修课列表
    /// </summary>
    /// <param name="StudentId"></param>
    /// /// <returns></returns>
    public static List<string> GetOptionCourse(string StudentId)
    {
        //选择学生,选修课
        return Dataset.ChengjiList.Where(x => x.StudentID == StudentId && x.SubType == enumSubType.OptionalSelect && x.Score > 0 && x.Type == "6")
               .Select(x => x.SubName).Distinct().ToList();
        //return Dataset.ChengjiList.Where(x => x.StudentID == StudentId && x.SubType == enumSubType.OptionalSelect && x.Score > 0 && x.Term=="2018-2019-1")
        //       .Select(x => x.SubName).Distinct().ToList();

    }

    /// <summary>
    /// 根据日期获得天气情况
    /// </summary>
    /// <param name="year"></param>
    /// <param name="month"></param>
    /// <param name="day"></param>
    /// <returns></returns>
    public static Weather GetWeatherByDate(string year, string month, string day)
    {
        var r = Dataset.WeatherList.Where(x => x.Year == year && x.Month == month && x.Day == day).ToList();
        if (r.Count == 1)
        {
            return r[0];
        }
        return null;
    }
}
