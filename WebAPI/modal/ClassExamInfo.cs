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
    internal List<Chengji> ChengjiList { get; set; }

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

    public int AllCnt
    {
        get
        {
            return ChengjiList.Count();
        }
    }

    public int AvilibleCnt
    {
        get
        {
            return ChengjiList.Where(x => x.Score > 0).Count();
        }
    }

    public float MaxScore
    {
        get
        {
            var r = ChengjiList.Where(x => x.Score > 0);
            if (r.Count() == 0) return -1;
            return r.Last().Score;
        }
    }

    public float MinScore
    {
        get
        {
            var r = ChengjiList.Where(x => x.Score > 0);
            if (r.Count() == 0) return -1;
            return r.First().Score;
        }
    }

    public double AvgScore
    {
        get
        {
            var r = ChengjiList.Where(x => x.Score > 0);
            if (r.Count() == 0) return -1;
            return System.Math.Round(r.Average(x => x.Score), 2);
        }
    }

    public double Std
    {
        get
        {
            var r = ChengjiList.Where(x => x.Score > 0);
            if (r.Count() == 0) return -1;
            return System.Math.Round((r.Select(x => (double)x.Score).ToList().StandardDeviation()), 2);
        }
    }

    public double Var
    {
        get
        {
            var r = ChengjiList.Where(x => x.Score > 0);
            if (r.Count() == 0) return -1;
            return System.Math.Round((r.Select(x => (double)x.Score).ToList().Variance()), 2);

        }
    }
}

