using System;
using System.Collections.Generic;
using System.Linq;
public class Chengji : IEqualityComparer<Chengji>
{
    /// <summary>
    /// 考试id
    /// </summary>
    /// <value></value>
    public string Id { get; set; }

    /// <summary>
    /// 班级单位的ID
    /// </summary>
    /// <value></value>
    public string IdForClass
    {
        get
        {
            //由于ID确定的考试，不能保证是同一个班级的，所以，这里重新设定一个班级单位的ID取代原本的ID
            return Number + ":" + SubId + ":" + ClassID;
        }
    }

    public string IdForGradeExam { get; set; }


    /// <summary>
    /// 考试编码
    /// </summary>
    /// <value></value>
    public string Number { get; set; }
    /// <summary>
    /// 考试编码名称
    /// </summary>
    /// <value></value>
    public string NumberName { get; set; }
    /// <summary>
    /// 考试学科id
    /// </summary>
    /// <value></value>
    public string SubId { get; set; }
    /// <summary>
    /// 考试学科名
    /// </summary>
    /// <value></value>
    public string SubName { get; set; }
    /// <summary>
    /// 考试学期
    /// </summary>
    /// <value></value>
    public string Term { get; set; }
    /// <summary>
    /// 考试类型（对应考试类型表）
    /// </summary>
    /// <value></value>
    public string Type { get; set; }
    /// <summary>
    /// 考试类型名称
    /// </summary>
    /// <value></value>
    public string TypeName
    {
        get
        {
            return Dataset.ExamTypeDic[Type];
        }
    }
    /// <summary>
    /// 考试开始时间
    /// </summary>
    /// <value></value>
    public string Sdate { get; set; }

    public string SdateYear { get; set; }
    public string SdateMonth { get; set; }
    public string SdateDay { get; set; }

    /// <summary>
    /// 学生id
    /// </summary>
    /// <value></value>
    public string StudentID { get; set; }

    public string StudentName { get; set; }
    /// <summary>
    /// 学生班级号
    /// </summary>
    /// <value></value>
    public string ClassID { get; set; }
    /// <summary>
    /// 学生班级名称
    /// </summary>
    /// <value></value>
    public string ClassName { get; set; }
    /// <summary>
    /// 学生年级
    /// </summary>
    /// <value></value>
    public string Grade { get; set; }
    /// <summary>
    /// 授课教师
    /// </summary>
    /// <value></value>
    public string TeacherID { get; set; }

    public string TeacherName { get; set; }

    /// <summary>
    /// 考试成绩(-1为作弊，-2为缺考，-3为免考)
    /// </summary>
    /// <value></value>
    public float Score { get; set; }

    private float _fullscore;
    /// <summary>
    /// 总分
    /// </summary>
    /// <value></value>
    public float FullScore
    {
        get
        {
            if (SubId == "99") return _fullscore;  //总分的情况,直接从私有变量拿值
            if (SubId == "98") return _fullscore;  //7选3的情况,直接从私有变量拿值
            //规则1：平时分数应该是15分
            if (Type == "4")
            {
                //特殊情况
                if (Id == "137971" || Id == "137972") return 20;
                if (SubId == "59")
                {
                    if (Score >= 60) return 90; //技术平时分异常情况
                }
                return 15;
            }

            //规则2：高三 五校联考，十校联考，三门主课总分150分
            if (NumberName.Contains("高三五校联考") || NumberName.Contains("高三十校联考"))
            {
                if (SubName == "语文" || SubName == "数学" || SubName == "英语") return 150;
            }

            //规则3:2018-1学期期中考试 语文150分
            if (Number == "000304")
            {
                if (SubName == "语文" && Grade == "高三") return 150;
            }

            return 100; //默认100;
        }
        set
        {
            _fullscore = value;
        }
    }

    /// <summary>
    /// 得分率
    /// </summary>
    /// <value></value>
    public double ScorePercent
    {
        get
        {
            if (Score <= 0) return 0;
            if (FullScore == 0) return 100;
            if (Score >= FullScore) return 100;
            return Math.Round(Score * 100 / (float)FullScore, 2);
        }
    }

    public float GradeAvg { get; set; }

    public float ClassAvg { get; set; }

    public float GradeAvgDiff
    {
        get
        {
            return Score - GradeAvg;
        }
    }
    public float ClassAvgDiff
    {
        get
        {
            return Score - ClassAvg;
        }
    }

    /// <summary>
    /// 换算成Z-score
    /// </summary>
    /// <value></value>
    public string ZScore { get; set; }
    /// <summary>
    /// 换算成T-score
    /// </summary>
    /// <value></value>
    public string TScore { get; set; }
    /// <summary>
    /// 换算成等第
    /// </summary>
    /// <value></value>
    public string Dengdi { get; set; }

    /// <summary>
    /// 年级组排名
    /// </summary>
    /// <value></value>
    public int GradeRank { get; set; }

    /// <summary>
    /// 班级排名
    /// </summary>
    /// <value></value>
    public int ClassRank { get; set; }

    /// <summary>
    /// 有效考试人数(年级组)
    /// </summary>
    /// <value></value>
    public int GradeAvalibleCnt { get; set; }
    /// <summary>
    /// 有效考试人数(班级)
    /// </summary>
    /// <value></value>
    public int ClassAvalibleCnt { get; set; }

    /// <summary>
    /// 年级排名百分比
    /// </summary>
    /// <value></value>
    public double GradeRankPercent
    {
        get
        {
            if (GradeRank > GradeAvalibleCnt) return 100; //无效分数的人
            return Math.Round(GradeRank * 100 / (float)GradeAvalibleCnt, 2);
        }
    }

    public double ClassRankPercent
    {
        get
        {
            if (ClassRank > ClassAvalibleCnt) return 100; //无效分数的人
            return Math.Round(ClassRank * 100 / (float)ClassAvalibleCnt, 2);
        }
    }

    /// <summary>
    /// 必修课
    /// </summary>
    /// <typeparam name="string"></typeparam>
    /// <returns></returns>
    public static List<string> MustSelect = new List<string>() { "语文", "数学", "英语" };
    /// <summary>
    /// 选修课
    /// </summary>
    /// <typeparam name="string"></typeparam>
    /// <returns></returns>
    public static List<string> OptionalSelect = new List<string>() { "地理", "化学", "技术", "历史", "生物", "物理", "政治" };

    /// <summary>
    /// 不同操作系统下面的Sort是不一样的，这里强制排序
    /// </summary>
    /// <param name="x"></param>
    /// <param name="y"></param>
    /// <returns></returns>
    public static Func<string, string, int> OptionalSelectSort =
        (string x, string y) =>
        {
            var x1 = -1;
            var y1 = -1;
            for (int i = 0; i < OptionalSelect.Count; i++)
            {
                if (x == OptionalSelect[i]) x1 = i;
                if (y == OptionalSelect[i]) y1 = i;
            }
            return x1 - y1;
        };



    public enum enumSubType
    {
        MustSelect = 2,
        OptionalSelect = 1,
        Misc = 0
    }

    /// <summary>
    /// 必修选修标记
    /// </summary>
    /// <value></value>
    public enumSubType SubType
    {
        get
        {
            if (MustSelect.Contains(SubName))
            {
                return enumSubType.MustSelect;
            }
            if (OptionalSelect.Contains(SubName))
            {
                return enumSubType.OptionalSelect;
            }
            return enumSubType.Misc;
        }
    }

    public Chengji(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        Id = Items[0];
        Number = Items[1];
        NumberName = Items[2].Trim();   //部分数据带Tab制表符..
        SubId = Items[3];
        SubName = Items[4];
        Term = Items[5];
        Type = Items[6];
        Sdate = Utility.FormatTime(Items[7]);
        SdateYear = Sdate.Split(" ")[0].Split("/")[0];
        SdateMonth = Sdate.Split(" ")[0].Split("/")[1];
        SdateDay = Sdate.Split(" ")[0].Split("/")[2];
        StudentID = Items[8];
        var s = Dataset.StudentList.Where(x => x.ID == StudentID);
        if (s.Count() == 1)
        {
            StudentName = s.First().Name;
            ClassID = s.First().ClassId;
            ClassName = s.First().ClassName;
            if (ClassName.Contains("高一"))
            {
                if (Term.StartsWith("2016-2017")) Grade = "初二";
                if (Term.StartsWith("2017-2018")) Grade = "初三";
                if (Term.StartsWith("2018-2019")) Grade = "高一";
            }

            if (ClassName.Contains("高二"))
            {
                if (Term.StartsWith("2016-2017")) Grade = "初三";
                if (Term.StartsWith("2017-2018")) Grade = "高一";
                if (Term.StartsWith("2018-2019")) Grade = "高二";
            }

            if (ClassName.Contains("高三"))
            {
                if (Term.StartsWith("2015-2016")) Grade = "初三";
                if (Term.StartsWith("2016-2017")) Grade = "高一";
                if (Term.StartsWith("2017-2018")) Grade = "高二";
                if (Term.StartsWith("2018-2019")) Grade = "高三";
            }
            if (String.IsNullOrEmpty(Grade)) Console.WriteLine("学号：" + StudentID + " 学期：" + Term);
            //根据班级号，SUBID检索授课教师ID
            var t = Dataset.TeacherList.Where(x => x.SubId == SubId && x.ClassId == ClassID);
            if (t.Count() == 1)
            {
                TeacherID = t.First().Id;
                TeacherName = t.First().Name;
            }
        }
        Score = float.Parse(Items[9]);
        if (Items[9].Length > 6)
        {
            Score = (float)Math.Round(Score, 2);
        }
        //Term + Type 不是Key，必须用Number
        IdForGradeExam = SubId + ":" + Number + ":" + Grade;
        ZScore = Items[10];
        TScore = Items[11];
        Dengdi = Items[12];
    }

    public Chengji()
    {
    }

    bool IEqualityComparer<Chengji>.Equals(Chengji x, Chengji y)
    {
        return x.Id.Equals(y.Id);
    }

    int IEqualityComparer<Chengji>.GetHashCode(Chengji obj)
    {
        return obj.ToString().GetHashCode();
    }

    /// <summary>
    /// 通过学号获得选修课列表
    /// </summary>
    /// <param name="StudentId"></param>
    /// <returns></returns>
    public static List<string> GetOptionCourse(string StudentId, string StardardType)
    {
        //选择学生,选修课
        return Dataset.ChengjiList.Where(x => x.StudentID == StudentId &&
                                         x.SubType == enumSubType.OptionalSelect &&
                                         x.Score > 0 && x.Type == StardardType)
                                    .Select(x => x.SubName).Distinct().ToList();
    }

}

/// <summary>
/// 用于成绩比较的简化版的成绩
/// </summary>
public class ChengjiSimple
{
    public string IdForGradeExam { get; set; }
    public string SubId { get; set; }
    public string SubName { get; set; }

    public string Number { get; set; }

    public string NumberName { get; set; }

    public float Score { get; set; }
    public float CompareToScore { get; set; }
    /// <summary>
    ///  比较结果
    /// </summary>
    /// <value></value>
    public string Result { get; set; }

    public string ResultText
    {
        get
        {
            if (Result == "0") return "一致";
            if (Result == "1") return "好于";
            if (Result == "-1") return "差于";
            return string.Empty;
        }
    }

    public ChengjiSimple(Chengji c)
    {
        IdForGradeExam = c.IdForGradeExam;
        SubId = c.SubId;
        SubName = c.SubName;
        Number = c.Number;
        NumberName = c.NumberName;
        Score = c.Score;
    }

}


public class AddtionalInfo
{
    public string Id { get; set; }

    public string StudentID { get; set; }


    public int GradeAvalibleCnt { get; set; }

    public int ClassAvalibleCnt { get; set; }

    public int GradeRank { get; set; }

    public int ClassRank { get; set; }


    public float GradeAvg { get; set; }

    public float ClassAvg { get; set; }
}

