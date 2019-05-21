using System;
using System.Linq;


/// <summary>
/// 个人月消费
/// </summary>
public class MonthConsumptionStudent
{
    public string ID { get; set; }
    public string Name { get; set; }
    public string Sex { get; set; }
    /// <summary>
    /// 是否住校
    /// </summary>
    /// <value></value>
    public bool LiveAtSchool { get; set; }
    public string ClassName { get; set; }
    public string Month { get; set; }
    public float Amount { get; set; }
}

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
    public string DealYearMonth
    {
        get
        {
            return DealTimeYear + DealTimeMonth;
        }
    }
    public string DealYearMonthDay
    {
        get
        {
            return DealTimeYear + DealTimeMonth + DealTimeDay;
        }
    }

    /// <summary>
    /// 消费金额
    /// </summary>
    /// <value></value>
    public Single MonDeal { get; set; }
    /// <summary>
    /// 对应学生信息表studentid
    /// </summary>
    /// <value></value>
    public string StudentID { get; set; }

    public Student Student
    {
        get
        {
            return Dataset.StudentList.Where(x => x.ID == StudentID).First();
        }
    }

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

    public DayOfWeek DayOfWeek { get; set; }

    public Weather Weather { get; set; }

    public Student ConsumpStudent { get; set; }

    public Consumption(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        DealTime = Utility.FormatTime(Items[0]);
        DealTimeYear = DealTime.Split(" ")[0].Split("/")[0];
        DealTimeMonth = DealTime.Split(" ")[0].Split("/")[1];
        DealTimeDay = DealTime.Split(" ")[0].Split("/")[2];
        DealTimeHour = DealTime.Split(" ")[1].Split(":")[0];
        MonDeal = Single.Parse(Items[1]);
        StudentID = Items[2];
        AccName = Items[3];
        PerSex = Items[4];
        DayOfWeek = new System.DateTime(int.Parse(DealTimeYear), int.Parse(DealTimeMonth), int.Parse(DealTimeDay)).DayOfWeek;
        Weather = Weather.GetWeatherByDate(DealTimeYear, DealTimeMonth, DealTimeDay);
        ConsumpStudent = Dataset.StudentList.Where(x => x.ID == StudentID).First();
    }

}

