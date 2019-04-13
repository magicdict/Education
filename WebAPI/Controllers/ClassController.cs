using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using static Education.Controllers.SchoolController;
using static Utility;

namespace Education.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassController : ControllerBase
    {

        /// <summary>
        /// 班级概要
        /// </summary>
        public class ClassOverview
        {
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
        }

        /// <summary>
        /// 获得班级概要
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetClassOverview")]
        public ActionResult<ClassOverview> GetClassOverview(string ClassId)
        {
            var overview = new ClassOverview();
            overview.Property = new StudentGroupProperty(Dataset.StudentList.Where(x => x.ClassId == ClassId).ToList()); 
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
                r.Add(new ClassExamInfo(chengjis));
            }
            overview.Exams = r;

            //班级考勤信息
            overview.Kaoqing = new List<NameValueSet>();
            foreach (var key in Dataset.KaoqinTypeDic.Keys)
            {
                var cnt = Dataset.KaoqinList.Count(x => x.ClassId == ClassId && x.DetailId == key);
                if (cnt > 0)
                {
                    overview.Kaoqing.Add(new NameValueSet()
                    {
                        name = Dataset.KaoqinTypeDic[key].control_task_name,
                        value = cnt
                    });
                }
            }
            return overview;
        }
    }
}
