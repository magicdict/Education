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

    /// <summary>
    /// 考试成绩(-1为作弊，-2为缺考，-3为免考)
    /// </summary>
    /// <value></value>
    public float Score { get; set; }
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
            ClassID = s.First().ClassId;
            ClassName = s.First().ClassName;
            if (ClassName.Contains("高一"))
            {
                if (Term.StartsWith("2018-2019")) Grade = "高一";
            }

            if (ClassName.Contains("高二"))
            {
                if (Term.StartsWith("2017-2018")) Grade = "高一";
                if (Term.StartsWith("2018-2019")) Grade = "高二";
            }

            if (ClassName.Contains("高三"))
            {
                if (Term.StartsWith("2016-2017")) Grade = "高一";
                if (Term.StartsWith("2017-2018")) Grade = "高二";
                if (Term.StartsWith("2018-2019")) Grade = "高三";
            }
            //根据班级号，SUBID检索授课教师ID
            var t = Dataset.TeacherList.Where(x => x.SubId == SubId && x.ClassId == ClassID);
            if (t.Count() == 1)
            {
                TeacherID = t.First().Id;
            }
        }
        Score = float.Parse(Items[9]);
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
}