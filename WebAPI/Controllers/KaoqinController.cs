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
            KaoqinOverviewInfo = overviewInfo;
        }

    }
}