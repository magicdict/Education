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
    public class KaoqinController : ControllerBase
    {
        /// <summary>
        /// 考勤的概要信息
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetKaoqinOverview")]
        public ActionResult<Dictionary<string, NameValueSet>> GetKaoqinOverview()
        {
            var r = new Dictionary<string, NameValueSet>();
            //按照大分类，中分类，小分类进行各个维度的统计
            foreach (var control_task_order_id in Dataset.KaoqinTypeDic.Keys)
            {
                var set = new NameValueSet()
                {
                    name = Dataset.KaoqinTypeDic[control_task_order_id].control_task_name,
                    value = Dataset.KaoqinList.Count(x => x.DetailId == control_task_order_id)
                };
                r.Add(control_task_order_id, set);
            }
            return r;
        }
    }
}