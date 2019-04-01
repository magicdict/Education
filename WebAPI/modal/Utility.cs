using System.Collections.Generic;

public static class Utility
{
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
        "北京",
        "天津",
        "重庆",
        "上海",
        "湖南",
        "广东",
        "福建",
        "江西",
        "四川",
        "广西",
        "新疆",
        "西藏",
        "青海",
        "甘肃",
        "宁夏",
        "内蒙古",
        "海南",
        "山西",
        "陕西",
        "云南",
        "贵州",
        "湖北",
        "浙江",
        "安徽",
        "河南",
        "山东",
        "江苏",
        "河北",
        "辽宁",
        "吉林",
        "黑龙江",
        "台湾"
    };

    public class NameValueSet
    {
        public string name { get; set; }
        public int value { get; set; }

    }

    public class SexRate
    {
        public int maleCnt;

        public int femaleCnt;

        public int malePercent
        {
            get
            {
                if (maleCnt + femaleCnt == 0) return 0;
                return maleCnt * 100 / (maleCnt + femaleCnt);
            }
        }

        public int femaleCntPercent
        {
            get
            {
                if (maleCnt + femaleCnt == 0) return 0;
                return 100 - malePercent;
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