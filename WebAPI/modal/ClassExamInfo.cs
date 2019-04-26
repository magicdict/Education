using System.Collections.Generic;
using System.Linq;
/// <summary>
/// 班级某次考试的统计结果
/// </summary>
public class ClassExamInfo
{
    /// <summary>
    /// 考试成绩
    /// </summary>
    /// <value></value>
    internal List<Chengji> ChengjiList { get; set; }

    public ClassExamInfo(List<Chengji> chengjis)
    {
        chengjis.Sort((x, y) => { return x.Score.CompareTo(y.Score); });
        ChengjiList = chengjis;
    }

    public Chengji Record
    {
        get
        {
            return ChengjiList.First();
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

    public Dictionary<string, int> FunnelDic
    {
        get
        {
            var dict = new Dictionary<string, int>();
            //如果是总分为15分的，则0-5，5-10，10-15分为标准的三段
            if (MaxScore <= 15)
            {
                dict.Add("0-5分", ChengjiList.Count(x => x.Score <= 5 && x.Score >= 0));
                dict.Add("0-10分", ChengjiList.Count(x => x.Score <= 10 && x.Score > 5));
                dict.Add("0-15分", ChengjiList.Count(x => x.Score <= 15 && x.Score > 10));
            }
            else
            {
                int ScoreStep = 5;
                if (MaxScore > 200) ScoreStep = 10;
                if (MaxScore > 500) ScoreStep = 25;
                //获得最高分和最低分，看一下是否是ScoreStep的倍数
                var MaxLimit = MaxScore % ScoreStep == 0 ? (int)MaxScore : (int)(MaxScore / ScoreStep) * ScoreStep + ScoreStep;
                var LowLimit = MinScore % ScoreStep == 0 ? (int)MinScore - ScoreStep : (int)(MinScore / ScoreStep) * ScoreStep;
                if (LowLimit < 0) LowLimit = 0; //特殊情况的排除
                for (int i = LowLimit; i < MaxLimit; i += ScoreStep)
                {
                    dict.Add(i + "-" + (i + ScoreStep) + "分", ChengjiList.Count(x => x.Score <= (i + ScoreStep) && x.Score > i));
                }
            }
            return dict;
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
    /// <summary>
    /// 保准差
    /// </summary>
    /// <value></value>
    public double Std
    {
        get
        {
            var r = ChengjiList.Where(x => x.Score > 0);
            if (r.Count() == 0) return -1;
            return System.Math.Round((r.Select(x => (double)x.Score).ToList().StandardDeviation()), 2);
        }
    }
    /// <summary>
    /// 方差
    /// </summary>
    /// <value></value>
    public double Var
    {
        get
        {
            var r = ChengjiList.Where(x => x.Score > 0);
            if (r.Count() == 0) return -1;
            return System.Math.Round((r.Select(x => (double)x.Score).ToList().Variance()), 2);

        }
    }

    /// <summary>
    /// 中位数
    /// </summary>
    /// <value></value>
    public double Mid
    {
        get
        {
            var r = ChengjiList.Where(x => x.Score > 0);
            if (r.Count() == 0) return -1;
            int cnt = r.Count();
            if (cnt % 2 != 0)
            {
                //奇数 3 => 3/2 = 1 Index From 0
                return r.ToArray()[cnt / 2].Score;
            }
            //偶数 4 => 4/2 = 2 = (1 + 2)/2 Index From 0
            return (r.ToArray()[cnt / 2 - 1].Score + r.ToArray()[cnt / 2].Score) / 2;
        }
    }

}

