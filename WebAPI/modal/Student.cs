using System.Collections.Generic;
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

    public string Grade
    {
        get
        {
            if (ClassName.Contains("高一")) return "高一";
            if (ClassName.Contains("高二")) return "高二";
            if (ClassName.Contains("高三")) return "高三";
            return string.Empty;
        }
    }

    /// <summary>
    /// 校区
    /// </summary>
    /// <value></value>
    public string Campus
    {
        get
        {
            if (ClassName.Contains("东"))
            {
                //新校区
                return "东";
            }
            else
            {
                //默认白杨校区
                return "白";
            }
        }
    }
    /// <summary>
    /// /// 家庭住址（省市或省）
    /// </summary>
    /// <value></value>
    public string NativePlace { get; set; }

    public bool IsNativePlaceZheJiang
    {
        get
        {
            var x = Utility.GetProvince(NativePlace);
            if (!string.IsNullOrEmpty(x))
            {
                if (x == "浙江")
                {
                    //明确是浙江
                    return true;
                }
            }
            else
            {
                //未知的省份
                foreach (var city in Utility.ZhejiangCity)
                {
                    if (NativePlace.Contains(city.Substring(0, 2)))
                    {
                        //浙江的城市
                        return true;
                    }
                }
            }
            return false;
        }
    }

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
    public bool LiveAtSchool { get; set; }
    /// <summary>
    /// 是否退学
    /// </summary>
    /// <value></value>
    public bool LeaveSchool { get; set; }
    /// <summary>
    /// 宿舍号
    /// </summary>
    /// <value></value>
    public string LiveRoomNo { get; set; }

    /// <summary>
    /// 高考选课情况(五校联考)
    /// </summary>
    /// <value></value>
    public List<string> OptionCourse_FiveSchool { get; set; }
    /// <summary>
    /// 高考选课情况(五校联考)
    /// </summary>
    /// <value></value>
    public List<string> OptionCourse_TenSchool { get; set; }
    /// <summary>
    /// 统计用
    /// </summary>
    /// <value></value>
    public List<string> OptionCourse { get; set; }

    public Student(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        ID = Items[0];
        Name = Items[1];
        Sex = Items[2];
        Nation = Items[3].Trim();
        BornDate = Items[4];
        ClassName = Items[5];
        NativePlace = Items[6];
        ResidenceType = Items[7];
        Policy = Items[8];
        ClassId = Items[9];
        ClassTerm = Items[10];
        if (!string.IsNullOrEmpty(Items[11]))
        {
            LiveAtSchool = true;
        }
        else
        {
            LiveAtSchool = false;
        }
        if (!string.IsNullOrEmpty(Items[12]))
        {
            LeaveSchool = true;
        }
        else
        {
            LeaveSchool = false;
        }
        LiveRoomNo = Items[13];
        if (!string.IsNullOrEmpty(LiveRoomNo))
        {
            LiveRoomNo = LiveRoomNo.Replace(".0", "");
        }
        else
        {
            LiveRoomNo = "-";
        }
    }
}