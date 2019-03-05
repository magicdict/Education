using System.Collections.Generic;

public class StudentInfo
{
    /// <summary>
    /// 基本信息
    /// </summary>
    /// <value></value>
    public Student BaseInfo { get; set; }

    /// <summary>
    /// 教师信息
    /// </summary>
    /// <value></value>
    public List<Teacher> Teachers { get; set; }

    /// <summary>
    /// 考勤信息
    /// </summary>
    /// <value></value>
    public List<Kaoqin> Kaoqins { get; set; }
    /// <summary>
    /// 成绩信息
    /// </summary>
    /// <value></value>
    public List<Chengji> Chengjis { get; set; }

    /// <summary>
    /// 成绩信息件数
    /// </summary>
    /// <value></value>
    public int ChengjiCnt { get; set; }

    /// <summary>
    /// 消费信息
    /// </summary>
    /// <value></value>
    public List<Consumption> Consumptions { get; set; }

    /// <summary>
    /// 消费信息件数
    /// </summary>
    /// <value></value>
    public int ConsumptionCnt { get; set; }
}