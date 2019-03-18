using System;
using System.Linq;

public class Consumption
{
    /// <summary>
    /// 消费时间
    /// </summary>
    /// <value></value>
    public string DealTime { get; set; }

    public string DealTimeYear { get; set; }
    public string DealTimeMonth { get; set; }
    public string DealTimeDay { get; set; }
    public string DealTimeHour { get; set; }

    /// <summary>
    /// 消费金额
    /// </summary>
    /// <value></value>
    public string MonDeal { get; set; }
    /// <summary>
    /// 对应学生信息表studentid
    /// </summary>
    /// <value></value>
    public string StudentID { get; set; }
    /// <summary>
    /// 姓名
    /// </summary>
    /// <value></value>
    public string AccName { get; set; }
    /// <summary>
    /// 性别
    /// </summary>
    /// <value></value>
    public string PerSex { get; set; }

    public DayOfWeek DayOfWeek
    {
        get
        {
            var day = new System.DateTime(int.Parse(DealTimeYear), int.Parse(DealTimeMonth), int.Parse(DealTimeDay));
            return day.DayOfWeek;
        }
    }

    public Consumption(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        DealTime = Utility.FormatTime(Items[0]);
        DealTimeYear = DealTime.Split(" ")[0].Split("/")[0];
        DealTimeMonth = DealTime.Split(" ")[0].Split("/")[1];
        DealTimeDay = DealTime.Split(" ")[0].Split("/")[2];
        DealTimeHour = DealTime.Split(" ")[1].Split(":")[0];
        MonDeal = Items[1];
        StudentID = Items[2];
        AccName = Items[3];
        PerSex = Items[4];
    }

}

