using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using static Utility;

namespace Education.Controllers
{

    public class KaoqinOverview
    {
        public Dictionary<string, NameValueSet> OverviewDict { get; set; }
        public Dictionary<string, List<NameValueSet>> MonthDict { get; set; }
        public List<NameValueSet> KaoqingTotal { get; set; }
        public List<NameValueSet> KaoqingMale { get; set; }
        public List<NameValueSet> KaoqingFeMale { get; set; }
        public List<NameValueSet> KaoqingLiveAtSchool { get; set; }
        public List<NameValueSet> KaoqingNotLiveAtSchool { get; set; }

        //按照时间进行堆叠
        public List<NameValueSet> TimePolar0099001 { get; set; }
        public List<NameValueSet> TimePolar0099002 { get; set; }
        public List<NameValueSet> TimePolar0099003 { get; set; }
        public List<NameValueSet> TimePolar0099004 { get; set; }
        public List<NameValueSet> TimePolar0099005 { get; set; }

        public List<string> MinuteList = new List<string>();

    }

    [Route("api/[controller]")]
    [ApiController]
    public class KaoqinController : ControllerBase
    {
        /// <summary>
        /// 考勤的概要信息
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetKaoqinOverview")]
        public ActionResult<KaoqinOverview> GetKaoqinOverview()
        {
            return KaoqinOverviewInfo;
        }

        static KaoqinOverview KaoqinOverviewInfo;

        public static void PrepareKaoqinOverview()
        {
            var overviewInfo = new KaoqinOverview();
            var OverviewDict = new Dictionary<string, NameValueSet>();
            var MonthDict = new Dictionary<string, List<NameValueSet>>();

            //按照大分类，中分类，小分类进行各个维度的统计
            foreach (var control_task_order_id in Dataset.KaoqinTypeDic.Keys)
            {
                var set = new NameValueSet()
                {
                    name = Dataset.KaoqinTypeDic[control_task_order_id].control_task_name,
                    value = Dataset.KaoqinList.Count(x => x.DetailId == control_task_order_id)
                };
                if (set.value > 0)
                {
                    //部分无数据的剔除
                    OverviewDict.Add(control_task_order_id, set);
                }

                var monthlist = new List<NameValueSet>();
                //按照月份进行统计 2014年1月-2019年12月
                for (int year = 2014; year <= 2019; year++)
                {
                    for (int month = 1; month <= 12; month++)
                    {
                        if (control_task_order_id.StartsWith("10"))
                        {
                            if ((year.ToString() + month.ToString("D2")).CompareTo("201603") > 0) continue;
                        }
                        if (control_task_order_id.StartsWith("20"))
                        {
                            if ((year.ToString() + month.ToString("D2")).CompareTo("201603") > 0) continue;
                        }
                        if (control_task_order_id.StartsWith("30"))
                        {
                            if ((year.ToString() + month.ToString("D2")).CompareTo("201406") > 0) continue;
                        }
                        if (control_task_order_id.StartsWith("99"))
                        {
                            if ((year.ToString() + month.ToString("D2")).CompareTo("201504") < 0) continue;
                        }
                        if (year == 2019 && month != 1) break;
                        var monthSet = new NameValueSet()
                        {
                            name = year.ToString() + month.ToString("D2"),
                            value = Dataset.KaoqinList.Count(x => x.DetailId == control_task_order_id &&
                                    x.RecDateTimeYear == year.ToString() && x.RecDateTimeMonth == month.ToString("D2"))
                        };
                        monthlist.Add(monthSet);
                    }
                }
                MonthDict.Add(control_task_order_id, monthlist);
            }
            overviewInfo.OverviewDict = OverviewDict;
            overviewInfo.MonthDict = MonthDict;
            overviewInfo.KaoqingTotal = new List<NameValueSet>();
            overviewInfo.KaoqingMale = new List<NameValueSet>();
            overviewInfo.KaoqingFeMale = new List<NameValueSet>();
            overviewInfo.KaoqingLiveAtSchool = new List<NameValueSet>();
            overviewInfo.KaoqingNotLiveAtSchool = new List<NameValueSet>();


            var CurrentStudent = Dataset.KaoqinList.Where(x => x.Student != null);
            foreach (var key in Dataset.KaoqinTypeDic2018.Keys)
            {
                overviewInfo.KaoqingTotal.Add(new NameValueSet()
                {
                    name = Dataset.KaoqinTypeDic[key].control_task_name,
                    value = CurrentStudent.Count(x => x.DetailId == key)
                });

                overviewInfo.KaoqingMale.Add(new NameValueSet()
                {
                    name = Dataset.KaoqinTypeDic[key].control_task_name,
                    value = CurrentStudent.Count(x => x.DetailId == key && x.Student.Sex == "男")
                });

                overviewInfo.KaoqingFeMale.Add(new NameValueSet()
                {
                    name = Dataset.KaoqinTypeDic[key].control_task_name,
                    value = CurrentStudent.Count(x => x.DetailId == key && x.Student.Sex == "女")
                });

                overviewInfo.KaoqingLiveAtSchool.Add(new NameValueSet()
                {
                    name = Dataset.KaoqinTypeDic[key].control_task_name,
                    value = CurrentStudent.Count(x => x.DetailId == key && x.Student.LiveAtSchool)
                });

                overviewInfo.KaoqingNotLiveAtSchool.Add(new NameValueSet()
                {
                    name = Dataset.KaoqinTypeDic[key].control_task_name,
                    value = CurrentStudent.Count(x => x.DetailId == key && !x.Student.LiveAtSchool)
                });
            }

            overviewInfo.TimePolar0099001 = new List<NameValueSet>();
            overviewInfo.TimePolar0099002 = new List<NameValueSet>();
            overviewInfo.TimePolar0099003 = new List<NameValueSet>();
            overviewInfo.TimePolar0099004 = new List<NameValueSet>();
            overviewInfo.TimePolar0099005 = new List<NameValueSet>();

            overviewInfo.MinuteList = new List<string>();
            for (int hour = 0; hour < 24; hour++)
            {
                for (int minute = 0; minute < 60; minute++)
                {
                    var hh = hour.ToString("D2");
                    var mm = minute.ToString("D2");
                    overviewInfo.MinuteList.Add(hh + ":" + mm);
                    var r = Dataset.Minute_99001.Find(x => x.name == hh + ":" + mm);
                    if (r == null)
                    {
                        overviewInfo.TimePolar0099001.Add(new NameValueSet() { name = hh + ":" + mm });
                    }
                    else
                    {
                        overviewInfo.TimePolar0099001.Add(r);
                    }

                    r = Dataset.Minute_99002.Find(x => x.name == hh + ":" + mm);
                    if (r == null)
                    {
                        overviewInfo.TimePolar0099002.Add(new NameValueSet() { name = hh + ":" + mm });
                    }
                    else
                    {
                        overviewInfo.TimePolar0099002.Add(r);
                    }

                    r = Dataset.Minute_99003.Find(x => x.name == hh + ":" + mm);
                    if (r == null)
                    {
                        overviewInfo.TimePolar0099003.Add(new NameValueSet() { name = hh + ":" + mm });
                    }
                    else
                    {
                        overviewInfo.TimePolar0099003.Add(r);
                    }

                    r = Dataset.Minute_99004.Find(x => x.name == hh + ":" + mm);
                    if (r == null)
                    {
                        overviewInfo.TimePolar0099004.Add(new NameValueSet() { name = hh + ":" + mm });
                    }
                    else
                    {
                        overviewInfo.TimePolar0099004.Add(r);
                    }

                    r = Dataset.Minute_99005.Find(x => x.name == hh + ":" + mm);
                    if (r == null)
                    {
                        overviewInfo.TimePolar0099005.Add(new NameValueSet() { name = hh + ":" + mm });
                    }
                    else
                    {
                        overviewInfo.TimePolar0099005.Add(r);
                    }

                }
            }
            KaoqinOverviewInfo = overviewInfo;
        }

    }
}