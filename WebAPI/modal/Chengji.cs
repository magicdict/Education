using System.Linq;
public class Chengji
{
    /// <summary>
    /// 考试id
    /// </summary>
    /// <value></value>
    public string mes_TestID { get; set; }

    /// <summary>
    /// 考试编码
    /// </summary>
    /// <value></value>
    public string exam_number { get; set; }
    /// <summary>
    /// 考试编码名称
    /// </summary>
    /// <value></value>
    public string exam_numname { get; set; }
    /// <summary>
    /// 考试学科id
    /// </summary>
    /// <value></value>
    public string mes_sub_id { get; set; }
    /// <summary>
    /// 考试学科名
    /// </summary>
    /// <value></value>
    public string mes_sub_name { get; set; }
    /// <summary>
    /// 考试学期
    /// </summary>
    /// <value></value>
    public string exam_term { get; set; }
    /// <summary>
    /// 考试类型（对应考试类型表）
    /// </summary>
    /// <value></value>
    public string exam_type { get; set; }
    /// <summary>
    /// 考试开始时间
    /// </summary>
    /// <value></value>
    public string exam_sdate { get; set; }
    /// <summary>
    /// 学生id
    /// </summary>
    /// <value></value>
    public string mes_StudentID { get; set; }
    /// <summary>
    /// 考试成绩(-1为作弊，-2为缺考，-3为免考)
    /// </summary>
    /// <value></value>
    public string mes_Score { get; set; }
    /// <summary>
    /// 换算成Z-score
    /// </summary>
    /// <value></value>
    public string mes_Z_Score { get; set; }
    /// <summary>
    /// 换算成T-score
    /// </summary>
    /// <value></value>
    public string mes_T_Score { get; set; }
    /// <summary>
    /// 换算成等第
    /// </summary>
    /// <value></value>
    public string mes_dengdi { get; set; }

    public Chengji(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        mes_TestID = Items[0];
        exam_number = Items[1];
        exam_numname = Items[2];
        mes_sub_id = Items[3];
        mes_sub_name = Items[4];
        exam_term = Items[5];
        exam_type = Items[6];
        exam_sdate = Items[7];
        mes_StudentID = Items[8];
        mes_Score = Items[9];
        mes_Z_Score = Items[10];
        mes_T_Score = Items[11];
        mes_dengdi = Items[12];
    }

}