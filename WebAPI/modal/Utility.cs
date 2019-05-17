using System.Collections.Generic;
using System;
using Education.Controllers;
using System.Linq;

public static class Utility
{
    public static List<string> WorkDays = new List<string>();

    public static int GetTotalDaysCnt()
    {
        if (WorkDays.Count != 0) return WorkDays.Count;
        var StartDate = new DateTime(2018, 9, 1);
        while (StartDate.CompareTo(new DateTime(2019, 1, 27)) != 0)
        {
            if (IsWorkDay(StartDate))
            {
                WorkDays.Add(StartDate.ToString("yyyyMMdd"));
            }
            StartDate = StartDate.AddDays(1);
        }
        Console.WriteLine("理论出勤天数：" + WorkDays.Count);
        return WorkDays.Count;
    }

    public static bool IsWorkDay(DateTime day)
    {
        if (day.DayOfWeek == DayOfWeek.Saturday || day.DayOfWeek == DayOfWeek.Sunday) return false;
        //中秋节
        if (day.Year == 2018 && day.Month == 9 && day.Day == 24) return false;
        //国庆节
        if (day.Year == 2018 && day.Month == 10 && (day.Day >= 1 && day.Day <= 7)) return false;
        //元旦
        if (day.Year == 2018 && day.Month == 12 && day.Day == 30) return false;
        if (day.Year == 2018 && day.Month == 12 && day.Day == 31) return false;
        if (day.Year == 2019 && day.Month == 1 && day.Day == 1) return false;
        //当日消费金额低于15000的
        var t = ConsumptionController.info.DailyConsumption.Where(x => x.name == day.ToString("yyyy-MM-dd")).First();
        if (t != null)
        {
            return (-1 * t.value) >= 15000;
        }
        return true;
    }

    public static string FormatTime(string DealTime)
    {
        var DealTimeYear = DealTime.Split(" ")[0].Split("/")[0];
        var DealTimeMonth = DealTime.Split(" ")[0].Split("/")[1];
        if (DealTimeMonth.Length == 1) DealTimeMonth = "0" + DealTimeMonth;
        var DealTimeDay = DealTime.Split(" ")[0].Split("/")[2];
        if (DealTimeDay.Length == 1) DealTimeDay = "0" + DealTimeDay;
        var DealTimeHour = DealTime.Split(" ")[1].Split(":")[0];
        if (DealTimeHour.Length == 1) DealTimeHour = "0" + DealTimeHour;
        var DealTimeMinute = DealTime.Split(" ")[1].Split(":")[1];
        if (DealTimeMinute.Length == 1) DealTimeMinute = "0" + DealTimeMinute;
        var DealTimeSecond = DealTime.Split(" ")[1].Split(":")[2];
        if (DealTimeSecond.Length == 1) DealTimeSecond = "0" + DealTimeSecond;

        return DealTimeYear + "/" + DealTimeMonth + "/" + DealTimeDay + " " + DealTimeHour + ":" + DealTimeMinute + ":" + DealTimeSecond;
    }

    public static List<string> Provinces = new List<string>(){
        "北京","天津","重庆","上海","湖南","广东",
        "福建","江西","四川","广西","新疆","西藏",
        "青海","甘肃","宁夏","内蒙古","海南","山西",
        "陕西","云南","贵州","湖北","浙江","安徽",
        "河南","山东","江苏","河北","辽宁","吉林",
        "黑龙江","台湾"
    };


    public static List<string> ZhejiangCity = new List<string>(){
        "杭州市","建德市","桐庐县","淳安县",
        "宁波市","余姚市","慈溪市","象山县","宁海县",
        "温州市","瑞安市","乐清市","永嘉县","平阳县","苍南县","文成县","泰顺县",
        "嘉兴市","海宁市","桐乡市","平湖市","嘉善县","海盐县",
        "湖州市","德清县","长兴县","安吉县",
        "绍兴市","嵊州市","诸暨市","新昌县",
        "金华市","义乌市","永康市","兰溪市","东阳市","武义县","浦江县","磐安县",
        "衢州市","江山市","常山县","开化县","龙游县",
        "舟山市","岱山县","嵊泗县",
        "台州市","温岭市","临海市","玉环市","三门县","天台县","仙居县",
        "丽水市","龙泉市","青田县","缙云县","遂昌县","松阳县","云和县","庆元县","景宁畲族自治县"
    };


    public class NameValueSet
    {
        public string name { get; set; }
        public int value { get; set; }

    }

    public class PNRateItem
    {
        public int PosCnt;

        public int NegCnt;

        public int PosPercent
        {
            get
            {
                if (PosCnt + NegCnt == 0) return 0;
                return PosCnt * 100 / (PosCnt + NegCnt);
            }
        }

        public int NegPercent
        {
            get
            {
                if (PosCnt + NegCnt == 0) return 0;
                return 100 - PosPercent;
            }
        }
    }
    public static string GetProvince(string Geo)
    {
        foreach (var province in Provinces)
        {
            if (Geo.Contains(province)) return province;
        }
        return string.Empty;
    }
}