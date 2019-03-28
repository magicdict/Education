using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using static Utility;

namespace Education.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsumptionController : ControllerBase
    {
        /// <summary>
        /// 学校整体消费信息
        /// </summary>
        public class SchoolConsumptionInfo
        {
            public List<NameValueSet> MonthlyConsumption = new List<NameValueSet>();
            public List<NameValueSet> MonthlyConsumptionLiveAtSchool = new List<NameValueSet>();
            public List<NameValueSet> MonthlyConsumptionNotLiveAtSchool = new List<NameValueSet>();

            public List<NameValueSet> WeekDayConsumption = new List<NameValueSet>();
            public List<NameValueSet> WeekDayConsumptionLiveAtSchool = new List<NameValueSet>();
            public List<NameValueSet> WeekDayConsumptionNotLiveAtSchool = new List<NameValueSet>();
            /// <summary>
            /// 最高消费
            /// </summary>
            /// <value></value>
            public List<Consumption> HighestRec { set; get; }
            /// <summary>
            /// 最高消费（住校）
            /// </summary>
            /// <value></value>
            public List<Consumption> HighestRecLiveAtSchool { set; get; }
            /// <summary>
            /// 最高消费（不住校）
            /// </summary>
            /// <value></value>
            public List<Consumption> HighestRecNotLiveAtSchool { set; get; }

            public int LiveAtSchoolCnt { set; get; }

            public int NotLiveAtSchoolCnt { set; get; }

        }


        /// <summary>
        /// 全体消费信息
        /// </summary>
        static SchoolConsumptionInfo info;

        /// <summary>
        /// 获得整个学校消费的统计信息
        /// </summary>
        /// /// <returns></returns>
        [HttpGet("GetSchoolConsumptionInfo")]
        public ActionResult<SchoolConsumptionInfo> GetSchoolConsumptionInfo()
        {
            return info;
        }
        /// <summary>
        /// 全体消费信息预先统计
        /// </summary>
        public static void PrepareSchoolConsumptionInfo()
        {
            var timer = new System.Diagnostics.Stopwatch();
            timer.Start();
            info = new SchoolConsumptionInfo();
            var LiveAtSchool = Dataset.ConsumptionList.Where(x => x.ConsumpStudent.LiveAtSchool);
            var NotLiveAtSchool = Dataset.ConsumptionList.Where(x => !x.ConsumpStudent.LiveAtSchool);
            //月度整体消费统计
            //2018/07 -> 2019/01 
            info.LiveAtSchoolCnt = Dataset.StudentList.Count(x => x.LiveAtSchool);
            info.NotLiveAtSchoolCnt = Dataset.StudentList.Count(x => !x.LiveAtSchool);

            var MonthTitle = new string[] { "201807", "201808", "201809", "201810", "201811", "201812", "201901" };
            foreach (var mon in MonthTitle)
            {
                var sum = Dataset.ConsumptionList.Where(x => x.DealYearMonth == mon).Sum(x => x.MonDeal);
                info.MonthlyConsumption.Add(new NameValueSet() { name = mon, value = -(Int32)sum });

                sum = LiveAtSchool.Where(x => x.DealYearMonth == mon).Sum(x => x.MonDeal);
                info.MonthlyConsumptionLiveAtSchool.Add(new NameValueSet() { name = mon, value = -(Int32)sum });

                sum = NotLiveAtSchool.Where(x => x.DealYearMonth == mon).Sum(x => x.MonDeal);
                info.MonthlyConsumptionNotLiveAtSchool.Add(new NameValueSet() { name = mon, value = -(Int32)sum });
            }

            //全体
            info.WeekDayConsumption.Add(new NameValueSet() { name = "周一", value = -(Int32)Dataset.ConsumptionList.Where(x => x.DayOfWeek == DayOfWeek.Monday).Sum(x => x.MonDeal) });
            info.WeekDayConsumption.Add(new NameValueSet() { name = "周二", value = -(Int32)Dataset.ConsumptionList.Where(x => x.DayOfWeek == DayOfWeek.Tuesday).Sum(x => x.MonDeal) });
            info.WeekDayConsumption.Add(new NameValueSet() { name = "周三", value = -(Int32)Dataset.ConsumptionList.Where(x => x.DayOfWeek == DayOfWeek.Wednesday).Sum(x => x.MonDeal) });
            info.WeekDayConsumption.Add(new NameValueSet() { name = "周四", value = -(Int32)Dataset.ConsumptionList.Where(x => x.DayOfWeek == DayOfWeek.Thursday).Sum(x => x.MonDeal) });
            info.WeekDayConsumption.Add(new NameValueSet() { name = "周五", value = -(Int32)Dataset.ConsumptionList.Where(x => x.DayOfWeek == DayOfWeek.Friday).Sum(x => x.MonDeal) });
            info.WeekDayConsumption.Add(new NameValueSet() { name = "周六", value = -(Int32)Dataset.ConsumptionList.Where(x => x.DayOfWeek == DayOfWeek.Saturday).Sum(x => x.MonDeal) });
            info.WeekDayConsumption.Add(new NameValueSet() { name = "周日", value = -(Int32)Dataset.ConsumptionList.Where(x => x.DayOfWeek == DayOfWeek.Sunday).Sum(x => x.MonDeal) });


            info.WeekDayConsumptionLiveAtSchool.Add(new NameValueSet() { name = "周一", value = -(Int32)LiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Monday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionLiveAtSchool.Add(new NameValueSet() { name = "周二", value = -(Int32)LiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Tuesday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionLiveAtSchool.Add(new NameValueSet() { name = "周三", value = -(Int32)LiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Wednesday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionLiveAtSchool.Add(new NameValueSet() { name = "周四", value = -(Int32)LiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Thursday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionLiveAtSchool.Add(new NameValueSet() { name = "周五", value = -(Int32)LiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Friday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionLiveAtSchool.Add(new NameValueSet() { name = "周六", value = -(Int32)LiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Saturday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionLiveAtSchool.Add(new NameValueSet() { name = "周日", value = -(Int32)LiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Sunday).Sum(x => x.MonDeal) });

            info.WeekDayConsumptionNotLiveAtSchool.Add(new NameValueSet() { name = "周一", value = -(Int32)NotLiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Monday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionNotLiveAtSchool.Add(new NameValueSet() { name = "周二", value = -(Int32)NotLiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Tuesday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionNotLiveAtSchool.Add(new NameValueSet() { name = "周三", value = -(Int32)NotLiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Wednesday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionNotLiveAtSchool.Add(new NameValueSet() { name = "周四", value = -(Int32)NotLiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Thursday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionNotLiveAtSchool.Add(new NameValueSet() { name = "周五", value = -(Int32)NotLiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Friday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionNotLiveAtSchool.Add(new NameValueSet() { name = "周六", value = -(Int32)NotLiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Saturday).Sum(x => x.MonDeal) });
            info.WeekDayConsumptionNotLiveAtSchool.Add(new NameValueSet() { name = "周日", value = -(Int32)NotLiveAtSchool.Where(x => x.DayOfWeek == DayOfWeek.Sunday).Sum(x => x.MonDeal) });



            Console.WriteLine(timer.Elapsed.ToString());
            //最高消费记录
            Dataset.ConsumptionList.Sort((x, y) => { return x.MonDeal.CompareTo(y.MonDeal); });
            info.HighestRec = Dataset.ConsumptionList.Take(3).ToList();
            info.HighestRecLiveAtSchool = Dataset.ConsumptionList.Where(x => x.ConsumpStudent.LiveAtSchool).Take(3).ToList();
            info.HighestRecNotLiveAtSchool = Dataset.ConsumptionList.Where(x => !x.ConsumpStudent.LiveAtSchool).Take(3).ToList();
            Console.WriteLine(timer.Elapsed.ToString());
            timer.Stop();
        }
    }
}
