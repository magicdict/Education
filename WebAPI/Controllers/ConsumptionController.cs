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
        /// 获得指定月度消费金额的学生列表
        /// </summary>
        /// <param name="limit"></param>
        /// <returns></returns>
        [HttpGet("GetStudentWithMonthLimit")]
        public ActionResult<List<MonthConsumptionStudent>> GetStudentWithMonthLimit(int limit)
        {
            return Dataset.StudentMonthlyConsumptionList.Where(x => x.Amount >= limit).ToList();
        }

        /// <summary>
        /// 根据学号获取月度消费统计记录
        /// </summary>
        /// <param name="studentId"></param>
        /// <returns></returns>
        [HttpGet("GetStudentMonthlyConsumption")]
        public ActionResult<List<MonthConsumptionStudent>> GetStudentMonthlyConsumption(string studentId)
        {
            return Dataset.StudentMonthlyConsumptionList.Where(x => x.ID == studentId).ToList();
        }

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
            /// <summary>
            /// 每日消费金额
            /// </summary>
            /// <typeparam name="NameValueSet"></typeparam>
            /// <returns></returns>
            public List<NameValueSet> DailyConsumption = new List<NameValueSet>();

            /// <summary>
            /// 每日消费人数
            /// </summary>
            /// <typeparam name="NameValueSet"></typeparam>
            /// <returns></returns>
            public List<NameValueSet> DailyConsumptionStudentCnt = new List<NameValueSet>();


            /// <summary>
            /// 周次时间统计
            /// </summary>
            /// <typeparam name="NameValueSet"></typeparam>
            /// <returns></returns>
            public List<NameValueSet> WeekTimeConsumption = new List<NameValueSet>();

            public List<NameValueSet> WeekTimeConsumptionLiveAtSchool = new List<NameValueSet>();

            public List<NameValueSet> WeekTimeConsumptionNotLiveAtSchool = new List<NameValueSet>();
            public List<NameValueSet> PerPriceRange = new List<NameValueSet>();
            /// <summary>
            /// 每个年级每日平均消费
            /// </summary>
            /// <typeparam name="NameValueSet"></typeparam>
            /// <returns></returns>
            public List<NameValueSet> PerDayByGrade = new List<NameValueSet>();
        }


        /// <summary>
        /// 全体消费信息
        /// </summary>
        public static SchoolConsumptionInfo info;

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

            var WeekDays = new DayOfWeek[] { DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday, DayOfWeek.Sunday };
            var WeekDayNames = new String[] { "周一", "周二", "周三", "周四", "周五", "周六", "周日" };

            for (int WeekIndex = 0; WeekIndex < 7; WeekIndex++)
            {
                info.WeekDayConsumption.Add(new NameValueSet()
                {
                    name = WeekDayNames[WeekIndex],
                    value = -(Int32)Dataset.ConsumptionList.Where(x => x.DayOfWeek == WeekDays[WeekIndex]).Sum(x => x.MonDeal)
                });
                //按照时间划分
                for (int hourIndex = 0; hourIndex < 24; hourIndex++)
                {
                    info.WeekTimeConsumption.Add(new NameValueSet()
                    {
                        name = WeekIndex + "-" + hourIndex,
                        value = -(Int32)Dataset.ConsumptionList.
                        Where(x => x.DayOfWeek == WeekDays[WeekIndex] && x.DealTimeHour == hourIndex.ToString("D2")).Sum(x => x.MonDeal)
                    });
                }

                info.WeekDayConsumptionLiveAtSchool.Add(new NameValueSet()
                {
                    name = WeekDayNames[WeekIndex],
                    value = -(Int32)LiveAtSchool.Where(x => x.DayOfWeek == WeekDays[WeekIndex]).Sum(x => x.MonDeal)
                });

                for (int hourIndex = 0; hourIndex < 24; hourIndex++)
                {
                    info.WeekTimeConsumptionLiveAtSchool.Add(new NameValueSet()
                    {
                        name = WeekIndex + "-" + hourIndex,
                        value = -(Int32)LiveAtSchool.
                        Where(x => x.DayOfWeek == WeekDays[WeekIndex] && x.DealTimeHour == hourIndex.ToString("D2")).Sum(x => x.MonDeal)
                    });
                }


                info.WeekDayConsumptionNotLiveAtSchool.Add(new NameValueSet()
                {
                    name = WeekDayNames[WeekIndex],
                    value = -(Int32)NotLiveAtSchool.Where(x => x.DayOfWeek == WeekDays[WeekIndex]).Sum(x => x.MonDeal)
                });

                for (int hourIndex = 0; hourIndex < 24; hourIndex++)
                {
                    info.WeekTimeConsumptionNotLiveAtSchool.Add(new NameValueSet()
                    {
                        name = WeekIndex + "-" + hourIndex,
                        value = -(Int32)NotLiveAtSchool.
                        Where(x => x.DayOfWeek == WeekDays[WeekIndex] && x.DealTimeHour == hourIndex.ToString("D2")).Sum(x => x.MonDeal)
                    });
                }
            }


            info.PerPriceRange.Add(new NameValueSet()
            {
                name = "10元以下",
                value = Dataset.ConsumptionList.Count(x => (-1 * x.MonDeal) <= 10)
            });
            info.PerPriceRange.Add(new NameValueSet()
            {
                name = "10-20元",
                value = Dataset.ConsumptionList.Count(x => (-1 * x.MonDeal) <= 20 && (-1 * x.MonDeal) > 10)
            });
            info.PerPriceRange.Add(new NameValueSet()
            {
                name = "20元-50元",
                value = Dataset.ConsumptionList.Count(x => (-1 * x.MonDeal) <= 50 && (-1 * x.MonDeal) > 20)
            });
            info.PerPriceRange.Add(new NameValueSet()
            {
                name = "50元以上",
                value = Dataset.ConsumptionList.Count(x => (-1 * x.MonDeal) > 50)
            });


            Console.WriteLine("消费月统计，周别统计：" + timer.Elapsed.ToString());

            info.DailyConsumption = Dataset.ConsumptionList.GroupBy(x => x.DealTimeYear + "-" + x.DealTimeMonth + "-" + x.DealTimeDay)
                    .Select(x => new NameValueSet()
                    {
                        name = x.Key,
                        value = (int)x.Sum(y => y.MonDeal)
                    }).ToList();

            info.DailyConsumptionStudentCnt = Dataset.ConsumptionList.GroupBy(x => x.DealTimeYear + "-" + x.DealTimeMonth + "-" + x.DealTimeDay)
                    .Select(x => new NameValueSet()
                    {
                        name = x.Key,
                        value = x.Select(y=>y.StudentID).Distinct().Count()
                    }).ToList();

            Console.WriteLine("消费日统计：" + timer.Elapsed.ToString());
            //最高消费记录
            Dataset.ConsumptionList.Sort((x, y) => { return x.MonDeal.CompareTo(y.MonDeal); });
            info.HighestRec = Dataset.ConsumptionList.Take(3).ToList();
            info.HighestRecLiveAtSchool = Dataset.ConsumptionList.Where(x => x.ConsumpStudent.LiveAtSchool).Take(3).ToList();
            info.HighestRecNotLiveAtSchool = Dataset.ConsumptionList.Where(x => !x.ConsumpStudent.LiveAtSchool).Take(3).ToList();

            Console.WriteLine("PerDayByGrade Start:" + timer.Elapsed.ToString());
            //PerDayByGrade
            var Grade1ConsumptionList = Dataset.ConsumptionList.Where(x => x.Student.Grade == "高一");
            var Grade2ConsumptionList = Dataset.ConsumptionList.Where(x => x.Student.Grade == "高二");
            var Grade3ConsumptionList = Dataset.ConsumptionList.Where(x => x.Student.Grade == "高三");
            var Grade1Sum = Grade1ConsumptionList.Sum(x => x.MonDeal);
            var Grade2Sum = Grade2ConsumptionList.Sum(x => x.MonDeal);
            var Grade3Sum = Grade3ConsumptionList.Sum(x => x.MonDeal);
            var DayStudentCntGrade1 = Grade1ConsumptionList.GroupBy(x => x.StudentID + x.DealYearMonthDay).Count();
            var DayStudentCntGrade2 = Grade2ConsumptionList.GroupBy(x => x.StudentID + x.DealYearMonthDay).Count();
            var DayStudentCntGrade3 = Grade3ConsumptionList.GroupBy(x => x.StudentID + x.DealYearMonthDay).Count();

            info.PerDayByGrade.Add(new NameValueSet { name = "高一", value = (int)(Grade1Sum / DayStudentCntGrade1) });
            info.PerDayByGrade.Add(new NameValueSet { name = "高二", value = (int)(Grade2Sum / DayStudentCntGrade2) });
            info.PerDayByGrade.Add(new NameValueSet { name = "高三", value = (int)(Grade3Sum / DayStudentCntGrade3) });

            Console.WriteLine("消费统计结束" + timer.Elapsed.ToString());
            timer.Stop();
        }
    }
}
