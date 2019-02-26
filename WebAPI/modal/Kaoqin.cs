using System.Linq;
public class Kaoqin
{
    /// <summary>
    /// 考勤ID
    /// </summary>
    /// <value></value>
    public string kaoqin_id { get; set; }
    /// <summary>
    /// 学期
    /// </summary>
    /// <value></value>
    public string qj_term { get; set; }
    /// <summary>
    /// 时间和日期
    /// </summary>
    /// <value></value>
    public string DataDateTime { get; set; }
    /// <summary>
    /// 对应考勤类型表里的ControllerID
    /// </summary>
    /// <value></value>
    public string ControllerID { get; set; }
    /// <summary>
    /// 考勤名称
    /// </summary>
    /// <value></value>
    public string controler_name { get; set; }
    /// <summary>
    /// 对应考勤类型表里的control_task_order_id
    /// </summary>
    /// <value></value>
    public string control_task_order_id { get; set; }
    /// <summary>
    /// 学生ID，对应学生信息表
    /// </summary>
    /// <value></value>
    public string bf_studentID { get; set; }
    /// <summary>
    /// 学生姓名
    /// </summary>
    /// <value></value>
    public string bf_Name { get; set; }
    /// <summary>
    /// 班级名
    /// </summary>
    /// <value></value>
    public string cla_Name { get; set; }
    /// <summary>
    /// 班级ID
    /// </summary>
    /// <value></value>
    public string bf_classid { get; set; }


public Kaoqin(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        kaoqin_id = Items[0];
        qj_term = Items[1];
        DataDateTime = Items[2];
        ControllerID = Items[3];
        controler_name = Items[4];
        control_task_order_id = Items[5];
        bf_studentID = Items[6];
        bf_Name = Items[7];
        cla_Name = Items[8];
        bf_classid = Items[9];
    }

}