using System.Linq;
public class Student
{
    /// <summary>
    /// 学生ID
    /// </summary>
    /// <value></value>
    public string ID { get; set; }
    /// <summary>
    /// 学生姓名
    /// </summary>
    /// <value></value>
    public string Name { get; set; }
    /// <summary>
    /// 性别
    /// </summary>
    /// <value></value>
    public string Sex { get; set; }
    /// <summary>
    /// 民族
    /// </summary>
    /// <value></value>
    public string Nation { get; set; }
    /// <summary>
    /// 出生日期（年）
    /// </summary>
    /// <value></value>
    public string BornDate { get; set; }
    /// <summary>
    /// 班级名（与teacher.csv的cla_name对应）
    /// </summary>
    /// <value></value>
    public string ClassName { get; set; }
    /// <summary>
    /// 家庭住址（省市或省）
    /// </summary>
    /// <value></value>
    public string NativePlace { get; set; }
    /// <summary>
    /// 家庭类型
    /// </summary>
    /// <value></value>
    public string ResidenceType { get; set; }
    /// <summary>
    /// 政治面貌
    /// </summary>
    /// <value></value>
    public string Policy { get; set; }
    /// <summary>
    /// 班级ID
    /// </summary>
    /// <value></value>
    public string ClassId { get; set; }
    /// <summary>
    /// 班级学期
    /// </summary>
    /// <value></value>
    public string ClassTerm { get; set; }
    /// <summary>
    /// 是否住校
    /// </summary>
    /// <value></value>
    public string LiveAtSchool { get; set; }
    /// <summary>
    /// 是否退学
    /// </summary>
    /// <value></value>
    public string LeaveSchool { get; set; }
    /// <summary>
    /// 宿舍号
    /// </summary>
    /// <value></value>
    public string LiveRoomNo { get; set; }


    public Student(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        ID = Items[0];
        Name = Items[1];
        Sex = Items[2];
        Nation = Items[3];
        BornDate = Items[4];
        ClassName = Items[5];
        NativePlace = Items[6];
        ResidenceType = Items[7];
        Policy = Items[8];
        ClassId = Items[9];
        ClassTerm = Items[10];
        LiveAtSchool = Items[11];
        if (!string.IsNullOrEmpty(LiveAtSchool)){
            LiveAtSchool = "是";
        }else{
            LiveAtSchool = "否";
        }
        LeaveSchool = Items[12];
        if (!string.IsNullOrEmpty(LeaveSchool)){
            LeaveSchool = "是";
        }else{
            LeaveSchool = "否";
        }
        LiveRoomNo = Items[13];
        if (!string.IsNullOrEmpty(LiveRoomNo)){
            LiveRoomNo = LiveRoomNo.Replace(".0","");
        }else{
            LiveRoomNo = "-";
        }
    }
}