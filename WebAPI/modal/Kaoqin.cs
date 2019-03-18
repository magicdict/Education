using System.Linq;
public class Kaoqin
{
    /// <summary>
    /// 考勤ID
    /// </summary>
    /// <value></value>
    public string Id { get; set; }
    /// <summary>
    /// 学期
    /// </summary>
    /// <value></value>
    public string Term { get; set; }
    /// <summary>
    /// 时间和日期
    /// </summary>
    /// <value></value>
    public string RecDateTime { get; set; }


    public string RecDateTimeYear { get; set; }


    public string RecDateTimeMonth { get; set; }


    public string RecDateTimeDay { get; set; }

    public string RecDateTimeHour { get; set; }


    /// <summary>
    /// 对应考勤类型表里的ControllerID
    /// </summary>
    /// <value></value>
    public string ControllerID { get; set; }
    /// <summary>
    /// 考勤名称
    /// </summary>
    /// <value></value>
    public string ControllerName { get; set; }
    /// <summary>
    /// 对应考勤类型表里的control_task_order_id
    /// </summary>
    /// <value></value>
    public string DetailId { get; set; }
    /// <summary>
    /// 学生ID，对应学生信息表
    /// </summary>
    /// <value></value>
    public string StudentID { get; set; }
    /// <summary>
    /// 学生姓名
    /// </summary>
    /// <value></value>
    public string StudentName { get; set; }
    /// <summary>
    /// 班级名
    /// </summary>
    /// <value></value>
    public string ClassName { get; set; }
    /// <summary>
    /// 班级ID
    /// </summary>
    /// <value></value>
    public string ClassId { get; set; }

    public Weather weather
    {
        get
        {
            return Dataset.GetWeatherByDate(RecDateTimeYear, RecDateTimeMonth, RecDateTimeDay);
        }
    }
    public Kaoqin(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        Id = Items[0];
        Term = Items[1];
        RecDateTime = Utility.FormatTime(Items[2]);
        RecDateTimeYear = RecDateTime.Split(" ")[0].Split("/")[0];
        RecDateTimeMonth = RecDateTime.Split(" ")[0].Split("/")[1];
        RecDateTimeDay = RecDateTime.Split(" ")[0].Split("/")[2];
        RecDateTimeHour = RecDateTime.Split(" ")[1].Split(":")[0];
        ControllerID = Items[3];
        ControllerName = Items[4];
        DetailId = Items[5];
        StudentID = Items[6];
        StudentName = Items[7];
        ClassName = Items[8];
        ClassId = Items[9];
    }

}