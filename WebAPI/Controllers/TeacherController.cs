using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Education.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        [HttpGet("QueryByTeacherId")]
        public ActionResult<TeacherInfo> QueryByTeacherId(string Id)
        {
            var baseinfo = new TeacherInfo();

            baseinfo.Records = Dataset.TeacherList.Where(x => x.Id == Id).ToList();
            //以学年（上下两个学期）进行分组
            foreach (var rec in baseinfo.Records)
            {
                //2018-2019-1
                var Term = rec.Term.Substring(0, 9);
                if (!baseinfo.GroupByTerm.ContainsKey(Term))
                {
                    baseinfo.GroupByTerm.Add(Term, new List<string>());
                }
                if (!baseinfo.GroupByTerm[Term].Contains(rec.ClassName))
                {
                    baseinfo.GroupByTerm[Term].Add(rec.ClassName);
                }
            }

            //当前2018-2019-1学期的考试成绩统计
            baseinfo.ClassExams = new List<ClassExamInfo>();
            foreach (var rec in baseinfo.Records)
            {
                if (rec.Term == "2018-2019-1")
                {
                    //今年班级的记录
                    var chengjiRecs = Dataset.ChengjiList.Where(x => x.TeacherID == Id && x.ClassID == rec.ClassId && x.Term == rec.Term).ToList();
                    var dic = new Dictionary<string, List<Chengji>>();
                    foreach (var chengji in chengjiRecs)
                    {
                        //注意：这里因为有跨班级考试问题，所以，为了以班级为单位输出，主键不能是ExamId
                        var Key = chengji.Number + ":" + chengji.SubId + ":" + chengji.ClassID;
                        if (!dic.ContainsKey(Key))
                        {
                            dic.Add(Key, new List<Chengji>());
                        }
                        dic[Key].Add(chengji);
                    }
                    foreach (var item in dic.Values)
                    {
                        item.Sort((x, y) => { return x.Score.CompareTo(y.Score); });
                        baseinfo.ClassExams.Add(new ClassExamInfo() { ChengjiList = item });
                    }
                }
            }
            return baseinfo;
        }

        [HttpGet("QueryTeacher")]
        public ActionResult<List<Teacher>> QueryTeacher(string GraName, string SubId)
        {

            if (string.IsNullOrEmpty(GraName) && !string.IsNullOrEmpty(SubId))
            {
                return Dataset.TeacherList.Where(x => x.SubId == SubId && x.Term == "2018-2019-1").Distinct(new Teacher()).ToList();
            }
            if (!string.IsNullOrEmpty(GraName) && string.IsNullOrEmpty(SubId))
            {
                return Dataset.TeacherList.Where(x => x.GraName == GraName && x.Term == "2018-2019-1").Distinct(new Teacher()).ToList();
            }
            return Dataset.TeacherList.Where(x => x.GraName == GraName && x.SubId == SubId && x.Term == "2018-2019-1").Distinct(new Teacher()).ToList();
        }

    }
}
