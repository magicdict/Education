using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using static Education.Controllers.SchoolController;
using static Utility;

namespace Education.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {

        public class GradeClassInfo
        {
            public string label { get; set; }
            public List<ClassBaseInfo> items { get; set; }
        }

        public class ClassBaseInfo
        {
            public string label { get; set; }

            public string value { get; set; }

            public int count { get; set; }
        }

        /// <summary>
        /// 班级概要
        /// </summary>
        public class ClassOverview
        {
            public string className { get; set; }

            public StudentGroupProperty Property { get; set; }

            /// <summary>
            /// 任课教师
            /// </summary>
            /// <value></value>
            public List<Teacher> Teachers { get; set; }
            /// <summary>
            /// 考试成绩
            /// </summary>
            /// <value></value>
            public List<ClassExamInfo> Exams { get; set; }

            /// <summary>
            /// 考勤数据
            /// </summary>
            /// <value></value>
            public List<NameValueSet> Kaoqing { get; set; }

            public List<NameValueSet> MonthlyConsumption { get; set; }

            public List<NameValueSet> WeeklyConsumption { get; set; }

            public List<NameValueSet> CourseSelect { get; set; }

            public List<statistics> ConsumptionStatisticsList { get; set; }

            public List<statisticsKaoqin> KaoqingStatisticsList { get; set; }
        }

        public class statistics
        {
            public string name { get; set; }
            public float max { get; set; }
            public float min { get; set; }
            public float avg { get; set; }
            public float sum { get; set; }
            public float cnt { get; set; }
        }

        public class statisticsKaoqin
        {
            public string name { get; set; }
            public List<NameValueSet> value { get; set; }
        }



        /// <summary>
        /// 获得班级概要
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetClassOverview")]
        public ActionResult<ClassOverview> GetClassOverview(string ClassId)
        {
            var overview = new ClassOverview();
            var studentlist = Dataset.StudentList.Where(x => x.ClassId == ClassId).ToList();
            overview.Property = new StudentGroupProperty(studentlist);
            //教师记录
            overview.Teachers = Dataset.TeacherList.Where(x => x.ClassId == ClassId).ToList();
            var All = Dataset.ChengjiList.Where(x => x.ClassID == ClassId).ToList();
            overview.className = studentlist.First().ClassName;
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
                r.Add(new ClassExamInfo(chengjis));
            }
            overview.Exams = r;

            //班级考勤信息
            overview.Kaoqing = new List<NameValueSet>();
            foreach (var key in Dataset.KaoqinTypeDic2018.Keys)
            {
                var cnt = Dataset.KaoqinList.Count(x => x.ClassId == ClassId && x.DetailId == key);
                if (cnt > 0)
                {
                    overview.Kaoqing.Add(new NameValueSet()
                    {
                        name = Dataset.KaoqinTypeDic2018[key].control_task_name,
                        value = cnt
                    });
                }
            }
            var ClassConsumption = Dataset.ConsumptionList.Where(x => x.ClassId == ClassId);
            overview.ConsumptionStatisticsList = ClassConsumption.GroupBy(x => x.DealYearMonthDay).Select(x =>
               {
                   //按照学生GroupBy，获得每个学生的当日总消费数组
                   var StudentGroup = x.GroupBy(z => z.StudentID).Select(m => m.Sum(n => -n.MonDeal));
                   return new statistics()
                   {
                       name = x.Key,
                       max = StudentGroup.Max(),
                       min = StudentGroup.Min(),
                       avg = StudentGroup.Average(),
                       sum = StudentGroup.Sum(),
                       cnt = StudentGroup.Count()
                   };
               }
            ).ToList();
            overview.ConsumptionStatisticsList.Sort((x, y) => { return x.name.CompareTo(y.name); });

            var ClassKaoqin = Dataset.KaoqinList.Where(x => x.ClassId == ClassId && x.ControllerID.StartsWith("9"));

            overview.KaoqingStatisticsList = ClassKaoqin.GroupBy(x => x.RecDateTimeYearMonthDay).Select(x =>
            {
                var KaoqinGroup = x.GroupBy(z => z.DetailId);
                var Controllerlist = KaoqinGroup.Select(n =>
                {
                    return new NameValueSet()
                    {
                        name = Dataset.KaoqinTypeDic[n.Key].control_task_name,
                        value = n.Count()
                    };
                });
                return new statisticsKaoqin()
                {
                    name = x.Key,
                    value = Controllerlist.ToList()
                };
            }).ToList();

            //高三七选三
            if (overview.className.Contains("高三"))
            {
                //五校联考
                overview.CourseSelect = CourseController.GetPickCourseOverview(studentlist, "6").selectionCourseCnt;
            }
            return overview;
        }
    }
}
