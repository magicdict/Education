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
    public class SchoolController : ControllerBase
    {

        /// <summary>
        /// 校区信息    
        /// </summary>
        public class Campus
        {
            /// <summary>
            /// 性别比例
            /// </summary>
            /// <value></value>
            public SexRate Grade1SexRate { get; set; }
            /// <summary>
            /// 性别比例
            /// </summary>
            /// <value></value>
            public SexRate Grade2SexRate { get; set; }
            /// <summary>
            /// 性别比例
            /// </summary>
            /// <value></value>
            public SexRate Grade3SexRate { get; set; }
            /// <summary>
            /// 整体性别比例
            /// </summary>
            /// <value></value>
            public SexRate TotalSexRate { get; set; }
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
            /// <summary>
            /// 按照科目统计老师人数
            /// </summary>
            /// <value></value>
            public Dictionary<string, int> TeacherSubCnt { get; set; }

            /// <summary>
            /// 学生数
            /// </summary>
            /// <value></value>
            public int StudentCnt { get; set; }

            /// <summary>
            /// 国际部
            /// </summary>
            /// <value></value>
            public int StudentIBCnt { get; set; }

            /// <summary>
            /// 班级数
            /// </summary>
            /// <value></value>
            public int ClassCnt { get; set; }
            /// <summary>
            /// 国际部班级数
            /// </summary>
            /// <value></value>
            public int ClassIBCnt { get; set; }
        }

        /// <summary>
        /// 概要
        /// </summary>
        public class Overview
        {
            public Campus BaiYang { get; set; }

            public Campus East { get; set; }

            public Campus Total { get; set; }

        }


        /// <summary>
        /// 获得概要
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetOverview")]
        public ActionResult<Overview> GetOverview()
        {
            var SchoolOver = new Campus();
            var BaiYang = new Campus();
            var East = new Campus();

            //只选择2018-2019-1学年的教师，教师可能会教多个班级，所以需要Distinct一下
            SchoolOver.TeacherCnt = Dataset.TeacherList.Where(x => x.Term == "2018-2019-1").Select(x => x.Id).Distinct().Count();
            SchoolOver.TeacherSubCnt = new Dictionary<string, int>();
            foreach (var teacherid in Dataset.TeacherList.Where(x => x.Term == "2018-2019-1").Select(x => x.Id).Distinct())
            {
                var teacher = Dataset.TeacherList.Where(x => x.Id == teacherid).First();
                if (!SchoolOver.TeacherSubCnt.ContainsKey(teacher.SubName)) SchoolOver.TeacherSubCnt.Add(teacher.SubName, 0);
                SchoolOver.TeacherSubCnt[teacher.SubName]++;
            }
            SchoolOver.StudentCnt = Dataset.StudentList.Count;
            SchoolOver.StudentIBCnt = Dataset.StudentList.Count(x => x.ClassName.Contains("IB"));
            SchoolOver.ClassCnt = Dataset.StudentList.Select(x => x.ClassName).Distinct().Count(y => { return !y.Contains("未分班"); });
            SchoolOver.ClassIBCnt = Dataset.StudentList.Select(x => x.ClassName).Distinct().Count(y => { return y.Contains("IB"); });

            BaiYang.TeacherCnt = Dataset.TeacherList.Where(x => x.Term == "2018-2019-1" && x.Campus == "白").Select(x => x.Id).Distinct().Count();
            BaiYang.TeacherSubCnt = new Dictionary<string, int>();
            foreach (var teacherid in Dataset.TeacherList.Where(x => x.Term == "2018-2019-1" && x.Campus == "白").Select(x => x.Id).Distinct())
            {
                var teacher = Dataset.TeacherList.Where(x => x.Id == teacherid).First();
                if (!BaiYang.TeacherSubCnt.ContainsKey(teacher.SubName)) BaiYang.TeacherSubCnt.Add(teacher.SubName, 0);
                BaiYang.TeacherSubCnt[teacher.SubName]++;
            }
            BaiYang.StudentCnt = Dataset.StudentList.Count(x => x.Campus == "白");
            BaiYang.StudentIBCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.ClassName.Contains("IB"));
            BaiYang.ClassCnt = Dataset.StudentList.Where(z => z.Campus == "白").Select(x => x.ClassName).Distinct().Count(y => { return !y.Contains("未分班"); });
            BaiYang.ClassIBCnt = Dataset.StudentList.Where(z => z.Campus == "白").Select(x => x.ClassName).Distinct().Count(y => { return y.Contains("IB"); });


            East.TeacherCnt = Dataset.TeacherList.Where(x => x.Term == "2018-2019-1" && x.Campus == "东").Select(x => x.Id).Distinct().Count();
            East.TeacherSubCnt = new Dictionary<string, int>();
            foreach (var teacherid in Dataset.TeacherList.Where(x => x.Term == "2018-2019-1" && x.Campus == "东").Select(x => x.Id).Distinct())
            {
                var teacher = Dataset.TeacherList.Where(x => x.Id == teacherid).First();
                if (!East.TeacherSubCnt.ContainsKey(teacher.SubName)) East.TeacherSubCnt.Add(teacher.SubName, 0);
                East.TeacherSubCnt[teacher.SubName]++;
            }
            East.StudentCnt = Dataset.StudentList.Count(x => x.Campus == "东");
            East.StudentIBCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.ClassName.Contains("IB"));
            East.ClassCnt = Dataset.StudentList.Where(z => z.Campus == "东").Select(x => x.ClassName).Distinct().Count(y => { return !y.Contains("未分班"); });
            East.ClassIBCnt = Dataset.StudentList.Where(z => z.Campus == "东").Select(x => x.ClassName).Distinct().Count(y => { return y.Contains("IB"); });

            SchoolOver.TotalSexRate = new SexRate();
            SchoolOver.Grade1SexRate = new SexRate();
            SchoolOver.Grade2SexRate = new SexRate();
            SchoolOver.Grade3SexRate = new SexRate();
            SchoolOver.TotalSexRate.maleCnt = Dataset.StudentList.Count(x => x.Sex == "男");
            SchoolOver.TotalSexRate.femaleCnt = Dataset.StudentList.Count(x => x.Sex == "女");
            SchoolOver.Grade1SexRate.maleCnt = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassName.Contains("高一"));
            SchoolOver.Grade1SexRate.femaleCnt = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassName.Contains("高一"));
            SchoolOver.Grade2SexRate.maleCnt = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassName.Contains("高二"));
            SchoolOver.Grade2SexRate.femaleCnt = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassName.Contains("高二"));
            SchoolOver.Grade3SexRate.maleCnt = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassName.Contains("高三"));
            SchoolOver.Grade3SexRate.femaleCnt = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassName.Contains("高三"));


            BaiYang.TotalSexRate = new SexRate();
            BaiYang.Grade1SexRate = new SexRate();
            BaiYang.Grade2SexRate = new SexRate();
            BaiYang.Grade3SexRate = new SexRate();
            BaiYang.TotalSexRate.maleCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "男");
            BaiYang.TotalSexRate.femaleCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "女");
            BaiYang.Grade1SexRate.maleCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "男" && x.ClassName.Contains("高一"));
            BaiYang.Grade1SexRate.femaleCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "女" && x.ClassName.Contains("高一"));
            BaiYang.Grade2SexRate.maleCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "男" && x.ClassName.Contains("高二"));
            BaiYang.Grade2SexRate.femaleCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "女" && x.ClassName.Contains("高二"));
            BaiYang.Grade3SexRate.maleCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "男" && x.ClassName.Contains("高三"));
            BaiYang.Grade3SexRate.femaleCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "女" && x.ClassName.Contains("高三"));


            East.TotalSexRate = new SexRate();
            East.Grade1SexRate = new SexRate();
            East.Grade2SexRate = new SexRate();
            East.Grade3SexRate = new SexRate();
            East.TotalSexRate.maleCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "男");
            East.TotalSexRate.femaleCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "女");
            East.Grade1SexRate.maleCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "男" && x.ClassName.Contains("高一"));
            East.Grade1SexRate.femaleCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "女" && x.ClassName.Contains("高一"));
            East.Grade2SexRate.maleCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "男" && x.ClassName.Contains("高二"));
            East.Grade2SexRate.femaleCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "女" && x.ClassName.Contains("高二"));
            East.Grade3SexRate.maleCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "男" && x.ClassName.Contains("高三"));
            East.Grade3SexRate.femaleCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "女" && x.ClassName.Contains("高三"));

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
            SchoolOver.GeoOptions = new List<NameValueSet>();
            foreach (var k in geodic.Keys)
            {
                SchoolOver.GeoOptions.Add(new NameValueSet() { name = k, value = geodic[k] });
            }
            return new Overview
            {
                Total = SchoolOver,
                BaiYang = BaiYang,
                East = East
            };
        }


    }
}
