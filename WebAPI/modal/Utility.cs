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
}