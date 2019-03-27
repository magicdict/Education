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
    public class GroupController : ControllerBase
    {
        /// <summary>
        /// 概要
        /// </summary>
        public class Overview
        {
            public int maleGrade1 { get; set; }
            public int femaleGrade1 { get; set; }
            public int maleGrade2 { get; set; }
            public int femaleGrade2 { get; set; }
            public int maleGrade3 { get; set; }
            public int femaleGrade3 { get; set; }
            public int maleTotal { get; set; }
            public int femaleTotal { get; set; }
            /// <summary>
            /// 生源地
            /// </summary>
            /// <value></value>
            public List<NameValueSet> GeoOptions { get; set; }
            /// <summary>
            /// 教师数
            /// </summary>
            /// <value></value>
            public int TeacherCnt { get; set; }
            public int StudentCnt { get; set; }
            public int StudentIBCnt { get; set; }

        }



        /// <summary>
        /// 获得概要
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetOverview")]
        public ActionResult<Overview> GetOverview()
        {
            var o = new Overview();
            //只选择2018-2019-1学年的教师，教师可能会教多个班级，所以需要Distinct一下
            o.TeacherCnt = Dataset.TeacherList.Where(x => x.Term == "2018-2019-1").Select(x => x.Id).Distinct().Count();
            o.StudentCnt = Dataset.StudentList.Count;
            o.StudentIBCnt = Dataset.StudentList.Count(x => x.ClassName.Contains("IB"));
            o.maleTotal = Dataset.StudentList.Count(x => x.Sex == "男");
            o.femaleTotal = Dataset.StudentList.Count(x => x.Sex == "女");
            o.maleGrade1 = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassName.Contains("高一"));
            o.femaleGrade1 = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassName.Contains("高一"));
            o.maleGrade2 = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassName.Contains("高二"));
            o.femaleGrade2 = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassName.Contains("高二"));
            o.maleGrade3 = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassName.Contains("高三"));
            o.femaleGrade3 = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassName.Contains("高三"));
            //获得地理信息
            var geodic = new Dictionary<string, int>();
            foreach (var province in Utility.Provinces)
            {
                geodic.Add(province, 0);
            }
            foreach (var item in Dataset.StudentList)
            {
                var x = Utility.GetProvince(item.NativePlace);
                if (!string.IsNullOrEmpty(x))
                {
                    geodic[x]++;
                }
                else
                {
                    //对于宁波的修正
                    if (item.NativePlace.Contains("宁波"))
                    {
                        geodic["浙江"]++;
                    }
                }
            }
            o.GeoOptions = new List<NameValueSet>();
            foreach (var k in geodic.Keys)
            {
                o.GeoOptions.Add(new NameValueSet() { name = k, value = geodic[k] });
            }
            return o;
        }

        /// <summary>
        /// 班级概要
        /// </summary>
        public class ClassOverview
        {
            public int maleCnt { get; set; }
            public int femaleCnt { get; set; }
            public List<NameValueSet> GeoOptions { get; set; }
            /// <summary>
            /// 任课教师
            /// </summary>
            /// <value></value>
            public List<Teacher> Teachers { get; set; }

            public List<ClassExamInfo> Exams { get; set; }
        }

        /// <summary>
        /// 获得班级概要
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetClassOverview")]
        public ActionResult<ClassOverview> GetClassOverview(string ClassId)
        {
            var overview = new ClassOverview();
            overview.maleCnt = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassId == ClassId);
            overview.femaleCnt = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassId == ClassId);
            //获得地理信息
            var geodic = new Dictionary<string, int>();
            foreach (var province in Utility.Provinces)
            {
                geodic.Add(province, 0);
            }
            foreach (var item in Dataset.StudentList.Where(x => x.ClassId == ClassId))
            {
                var x = Utility.GetProvince(item.NativePlace);
                if (!string.IsNullOrEmpty(x))
                {
                    geodic[x]++;
                }
                else
                {
                    //对于宁波的修正
                    if (item.NativePlace.Contains("宁波"))
                    {
                        geodic["浙江"]++;
                    }
                }
            }
            overview.GeoOptions = new List<NameValueSet>();
            foreach (var k in geodic.Keys)
            {
                overview.GeoOptions.Add(new NameValueSet() { name = k, value = geodic[k] });
            }
            //教师记录
            overview.Teachers = Dataset.TeacherList.Where(x => x.ClassId == ClassId).ToList();


            var All = Dataset.ChengjiList.Where(x => x.ClassID == ClassId).ToList();
            var dic = new Dictionary<string, List<Chengji>>();
            foreach (var chengjiRec in All)
            {
                var key = chengjiRec.Number + ":" + chengjiRec.SubId;
                if (!dic.ContainsKey(key)) dic.Add(key, new List<Chengji>());
                dic[key].Add(chengjiRec);
            }
            var r = new List<ClassExamInfo>();
            foreach (var key in dic.Keys)
            {
                var chengjis = dic[key];
                chengjis.Sort((x, y) => { return x.Score.CompareTo(y.Score); });
                r.Add(new ClassExamInfo() { ChengjiList = chengjis });
            }
            overview.Exams = r;

            return overview;
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

        }

        /// <summary>
        /// 获得整个学校消费的统计信息
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetSchoolConsumptionInfo")]
        public ActionResult<SchoolConsumptionInfo> GetSchoolConsumptionInfo()
        {
            var timer = new System.Diagnostics.Stopwatch();
            timer.Start();

            var LiveAtSchool = Dataset.ConsumptionList.Where(x => x.ConsumpStudent.LiveAtSchool);
            var NotLiveAtSchool = Dataset.ConsumptionList.Where(x => !x.ConsumpStudent.LiveAtSchool);


            var info = new SchoolConsumptionInfo();
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
            return info;
        }

    }
}
