using System.Linq;
public class Chengji
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
    /// 考试成绩(-1为作弊，-2为缺考，-3为免考)
    /// </summary>
    /// <value></value>
    public string Score { get; set; }
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

    public Chengji(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        Id = Items[0];
        Number = Items[1];
        NumberName = Items[2];
        SubId = Items[3];
        SubName = Items[4];
        Term = Items[5];
        Type = Items[6];
        Sdate = Utility.FormatTime(Items[7]);
        SdateYear = Sdate.Split(" ")[0].Split("/")[0];
        SdateMonth = Sdate.Split(" ")[0].Split("/")[1];
        SdateDay = Sdate.Split(" ")[0].Split("/")[2];
        StudentID = Items[8];
        Score = Items[9];
        ZScore = Items[10];
        TScore = Items[11];
        Dengdi = Items[12];
    }

}