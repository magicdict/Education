using System.Linq;
public class Teacher
{
    /// <summary>
    /// 学期
    /// </summary>
    /// <value></value>
    public string term { get; set; }

    /// <summary>
    /// 班级ID
    /// </summary>
    /// <value></value>
    public string cla_id { get; set; }

    /// <summary>
    /// 班级名
    /// </summary>
    /// <value></value>
    public string cla_Name { get; set; }

    /// <summary>
    /// 年级名
    /// </summary>
    /// <value></value>
    public string gra_Name { get; set; }

    /// <summary>
    /// 学科ID
    /// </summary>
    /// <value></value>
    public string sub_id { get; set; }

    /// <summary>
    /// 学科名
    /// </summary>
    /// <value></value>
    public string sub_Name { get; set; }

    /// <summary>
    /// 教师id
    /// </summary>
    /// <value></value>
    public string bas_id { get; set; }

    /// <summary>
    /// 教师名
    /// </summary>
    /// <value></value>
    public string bas_Name { get; set; }

    public Teacher(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        term = Items[0];
        cla_id = Items[1];
        cla_Name = Items[2];
        gra_Name = Items[3];
        sub_id = Items[4];
        sub_Name = Items[5];
        bas_id = Items[6];
        bas_Name = Items[7];
    }

}