using System.Linq;
public class Consumption
{
    /// <summary>
    /// 消费时间
    /// </summary>
    /// <value></value>
    public string DealTime { get; set; }
    /// <summary>
    /// 消费金额
    /// </summary>
    /// <value></value>
    public string MonDeal { get; set; }
    /// <summary>
    /// 对应学生信息表studentid
    /// </summary>
    /// <value></value>
    public string bf_studentID { get; set; }
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

    public Consumption(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        DealTime = Items[0];
        MonDeal = Items[1];
        bf_studentID = Items[2];
        AccName = Items[3];
        PerSex = Items[4];
    }

}