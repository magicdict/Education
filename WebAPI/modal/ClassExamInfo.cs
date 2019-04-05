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

    public ClassExamInfo(List<Chengji> chengjis){
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
                //获得最高分和最低分，看一下是否是5的倍数
                var MaxLimit = MaxScore % 5 == 0 ? (int)MaxScore : (int)(MaxScore / 5) * 5 + 5;
                var LowLimit = MinScore % 5 == 0 ? (int)MinScore - 5 : (int)(MinScore / 5) * 5;
                if (LowLimit < 0) LowLimit = 0; //特殊情况的排除
                for (int i = LowLimit; i < MaxLimit; i += 5)
                {
                    dict.Add(i + "-" + (i + 5) + "分", ChengjiList.Count(x => x.Score <= (i + 5) && x.Score > i));
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

