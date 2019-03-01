using System.Linq;
public class Teacher
{
    /// <summary>
    /// 学期
    /// </summary>
    /// <value></value>
    public string Term { get; set; }

    /// <summary>
    /// 班级ID
    /// </summary>
    /// <value></value>
    public string ClassId { get; set; }

    /// <summary>
    /// 班级名
    /// </summary>
    /// <value></value>
    public string ClassName { get; set; }

    /// <summary>
    /// 年级名
    /// </summary>
    /// <value></value>
    public string GraName { get; set; }

    /// <summary>
    /// 学科ID
    /// </summary>
    /// <value></value>
    public string SubId { get; set; }

    /// <summary>
    /// 学科名
    /// </summary>
    /// <value></value>
    public string SubName { get; set; }

    /// <summary>
    /// 教师id
    /// </summary>
    /// <value></value>
    public string Id { get; set; }

    /// <summary>
    /// 教师名
    /// </summary>
    /// <value></value>
    public string Name { get; set; }

    public Teacher(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        Term = Items[0];
        ClassId = Items[1];
        ClassName = Items[2];
        GraName = Items[3];
        SubId = Items[4];
        SubName = Items[5];
        Id = Items[6];
        Name = Items[7];
    }

}