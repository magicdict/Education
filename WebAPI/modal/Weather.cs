using System.Linq;
public class Weather
{
    /// <summary>
    /// 学期
    /// </summary>
    /// <value></value>
    public string Year { get; set; }

    public string Month { get; set; }

    public string Day { get; set; }

    public int High { get; set; }

    public int Low { get; set; }

    public string Type { get; set; }

    public Weather(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        Year = Items[1].Split("/")[0];
        Month = Items[1].Split("/")[1];
        Day = Items[1].Split("/")[2].Substring(0, 2);    //去除有星期几的情况
        Type = Items[2];
        Low = int.Parse(Items[3].Split("~")[0]);
        High = int.Parse(Items[3].Split("~")[1].Replace("℃", ""));
    }

    /// <summary>
    /// 根据日期获得天气情况
    /// </summary>
    /// <param name="year"></param>
    /// <param name="month"></param>
    /// <param name="day"></param>
    /// <returns></returns>
    public static Weather GetWeatherByDate(string year, string month, string day)
    {
        var r = Dataset.WeatherList.Where(x => x.Year == year && x.Month == month && x.Day == day).ToList();
        if (r.Count == 1)
        {
            return r[0];
        }
        return null;
    }

}