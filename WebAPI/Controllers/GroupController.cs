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

            public List<NameValueSet> GeoOptions { get; set; }
        }



        /// <summary>
        /// 获得班级某科目成绩信息
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetOverview")]
        public ActionResult<Overview> GetOverview()
        {
            var o = new Overview();
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
    }
}
