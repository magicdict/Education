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

public static class CreateCahceFile
{

    public static void CreateHourMinute(string fullpath)
    {
        var sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "HourMinuteRec.csv");
        var CurrentStudent = Dataset.KaoqinList.Where(x => x.Student != null);
        sw.WriteLine("TimeStamp,ControlId,Cnt");
        foreach (var controlid in new string[] { "99001", "99002", "99003", "99004", "99005" })
        {
            var CurrentStudent0099001 = CurrentStudent.Where(x => x.ControllerID == controlid);
            var groupcnt = CurrentStudent0099001.GroupBy(x => x.RecDateTimeHour + ":" + x.RecDateTimeMinute).Select(x => new NameValueSet()
            {
                name = x.Key,
                value = x.Count()
            });
            foreach (var item in groupcnt)
            {
                sw.WriteLine(item.name + "," + controlid + "," + item.value);
            }
        }
        var ConsumptionGroupcnt = Dataset.ConsumptionList.GroupBy(x => x.DealTimeHour + ":" + x.DealTimeMinute).Select(x => new NameValueSet()
        {
            name = x.Key,
            value = x.Count()
        });
        foreach (var item in ConsumptionGroupcnt)
        {
            sw.WriteLine(item.name + "," + "00000" + "," + item.value);
        }
        sw.Close();
    }

    public static void CreatePresentStudentList(string fullpath)
    {
        //假设如果该天出勤，就应该有至少一条消费记录
        var sw = new StreamWriter(fullpath + System.IO.Path.DirectorySeparatorChar + "PresentStudentList.csv");
        sw.WriteLine("studentId,date");

        foreach (var student in Dataset.StudentList)
        {
            //如果该学生没有任何一条消费记录，则跳过
            if (Dataset.ConsumptionList.Count(x => x.StudentID == student.ID) == 0) continue;

            foreach (var workday in Utility.WorkDays)
            {
                if (Dataset.ConsumptionList.Count(x => x.StudentID == student.ID &&
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
    public static void CreateTotalScoreForGrade3()
    {
        var TotalScoreList_FiveSchool = new List<Chengji>();
        var ClassDict = new Dictionary<String, int>();

        //高三学生五校联考
        foreach (var student in Dataset.StudentList)
        {
            if (student.OptionCourse_FiveSchool != null &&
                student.OptionCourse_FiveSchool.Count == 3)
            {
                var Temp = Dataset.ChengjiList.Where(x => x.Type == "6" &&
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
                var Temp = Dataset.ChengjiList.Where(x => x.Type == "7" &&
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
        //获得考试数：Number做Distinct
        float TenAvg = TotalScoreList_TenSchool.Average(x => x.Score);
        foreach (var chengji in TotalScoreList_TenSchool)
        {
            chengji.SubId = "98";
            chengji.SubName = "7选3";
            chengji.GradeRank = TotalScoreList_TenSchool.Count(x => x.Score > chengji.Score) + 1;
            chengji.GradeAvg = TenAvg;
            chengji.GradeAvalibleCnt = TotalScoreList_TenSchool.Count;
            chengji.FullScore = 300;

            chengji.ClassRank = TotalScoreList_TenSchool.Count(x => x.Score > chengji.Score && x.ClassID == chengji.ClassID) + 1;
            chengji.ClassAvg = TotalScoreList_TenSchool.Where(x => x.ClassID == chengji.ClassID).Average(x => x.Score);
            chengji.ClassAvalibleCnt = TotalScoreList_TenSchool.Count(x => x.ClassID == chengji.ClassID);
            Dataset.ChengjiList.Add(chengji);
        }

        float FiveAvg = TotalScoreList_FiveSchool.Average(x => x.Score);
        foreach (var chengji in TotalScoreList_FiveSchool)
        {
            chengji.SubId = "98";
            chengji.SubName = "7选3";
            chengji.GradeRank = TotalScoreList_FiveSchool.Count(x => x.Score > chengji.Score) + 1;
            chengji.GradeAvg = FiveAvg;
            chengji.GradeAvalibleCnt = TotalScoreList_FiveSchool.Count;
            chengji.FullScore = 300;

            chengji.ClassRank = TotalScoreList_FiveSchool.Count(x => x.Score > chengji.Score && x.ClassID == chengji.ClassID) + 1;
            chengji.ClassAvg = TotalScoreList_FiveSchool.Where(x => x.ClassID == chengji.ClassID).Average(x => x.Score);
            chengji.ClassAvalibleCnt = TotalScoreList_FiveSchool.Count(x => x.ClassID == chengji.ClassID);
            Dataset.ChengjiList.Add(chengji);

        }
    }


    public static void CreateTotalScore(string fullpath)
    {
        StreamWriter sw;
        var CntComplete = 0;

        var TotalScoreList = new ConcurrentBag<Chengji>();
        var NumberUnion = Dataset.ChengjiList.Select(x => x.Number).Distinct();
        Parallel.ForEach(NumberUnion, ExamNumber =>
        {
            //参加该次考试的学生ID列表
            var StudentIds = Dataset.ChengjiList.Where(x => x.Number == ExamNumber).Select(x => x.StudentID).Distinct();
            Parallel.ForEach(StudentIds, StudentID =>
            {
                var Temp = Dataset.ChengjiList.Where(x => x.Number == ExamNumber && x.StudentID == StudentID);
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
        var ExamUnion = Dataset.ChengjiList.Select(x => x.IdForGradeExam).Distinct();
        //学期，考试类型，科目，年级 分组,获得排名
        CntComplete = 0;
        Parallel.ForEach(ExamUnion, IdForGradeExam =>
        {
            var temp = Dataset.ChengjiList.Where(x => x.IdForGradeExam == IdForGradeExam);
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


        ExamUnion = Dataset.ChengjiList.Select(x => x.IdForClass).Distinct();
        CntComplete = 0;
        Parallel.ForEach(ExamUnion, IdForClass =>
        {
            var temp = Dataset.ChengjiList.Where(x => x.IdForClass == IdForClass);
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