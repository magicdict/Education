using System.Collections.Generic;
using System.Linq;
/// <summary>
/// 班级某次考试的统计结果
/// </summary>
public class ClassExamInfo
{
    /// <summary>
    /// 考试代码
    /// </summary>
    /// <value></value>
    public List<Chengji> ChengjiList { get; set; }

    public string ExamName
    {
        get
        {
            return ChengjiList.First().NumberName;
        }
    }

    public string ClassName
    {
        get
        {
            return ChengjiList.First().ClassName;
        }
    }

    public float MaxScore
    {
        get
        {
            return ChengjiList.Where(x => x.Score > 0).Last().Score;
        }
    }

    public float MinScore
    {
        get
        {
            //去除小于等于0的情况
            return ChengjiList.Where(x => x.Score > 0).First().Score;
        }
    }

    public double AvgScore
    {
        get
        {
            return System.Math.Round(ChengjiList.Where(x => x.Score > 0).Average(x => x.Score), 2);
        }
    }

    public double Std
    {
        get
        {
            return System.Math.Round((ChengjiList.Where(x => x.Score > 0).Select(x => (double)x.Score).ToList().StandardDeviation()), 2);
        }
    }

    public double Var
    {
        get
        {
            return System.Math.Round((ChengjiList.Where(x => x.Score > 0).Select(x => (double)x.Score).ToList().Variance()), 2);

        }
    }
}

