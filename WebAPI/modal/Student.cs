using System.Linq;
public class Student
{
    /// <summary>
    /// 学生ID
    /// </summary>
    /// <value></value>
    public string bf_StudentID { get; set; }
    /// <summary>
    /// 学生姓名
    /// </summary>
    /// <value></value>
    public string bf_Name { get; set; }
    /// <summary>
    /// 性别
    /// </summary>
    /// <value></value>
    public string bf_sex { get; set; }
    /// <summary>
    /// 民族
    /// </summary>
    /// <value></value>
    public string bf_nation { get; set; }
    /// <summary>
    /// 出生日期（年）
    /// </summary>
    /// <value></value>
    public string bf_BornDate { get; set; }
    /// <summary>
    /// 班级名（与teacher.csv的cla_name对应）
    /// </summary>
    /// <value></value>
    public string cla_Name { get; set; }
    /// <summary>
    /// 家庭住址（省市或省）
    /// </summary>
    /// <value></value>
    public string bf_NativePlace { get; set; }
    /// <summary>
    /// 家庭类型
    /// </summary>
    /// <value></value>
    public string Bf_ResidenceType { get; set; }
    /// <summary>
    /// 政治面貌
    /// </summary>
    /// <value></value>
    public string bf_policy { get; set; }
    /// <summary>
    /// 班级ID
    /// </summary>
    /// <value></value>
    public string cla_id { get; set; }
    /// <summary>
    /// 班级学期
    /// </summary>
    /// <value></value>
    public string cla_term { get; set; }
    /// <summary>
    /// 是否住校
    /// </summary>
    /// <value></value>
    public string bf_zhusu { get; set; }
    /// <summary>
    /// 是否退学
    /// </summary>
    /// <value></value>
    public string bf_leaveSchool { get; set; }
    /// <summary>
    /// 宿舍号
    /// </summary>
    /// <value></value>
    public string bf_qinshihao { get; set; }


    public Student(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        bf_StudentID = Items[0];
        bf_Name = Items[1];
        bf_sex = Items[2];
        bf_nation = Items[3];
        bf_BornDate = Items[4];
        cla_Name = Items[5];
        bf_NativePlace = Items[6];
        Bf_ResidenceType = Items[7];
        bf_policy = Items[8];
        cla_id = Items[9];
        cla_term = Items[10];
        bf_zhusu = Items[11];
        bf_leaveSchool = Items[12];
        bf_qinshihao = Items[13];
    }


}