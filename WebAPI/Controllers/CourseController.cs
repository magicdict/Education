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
    public class CourseController : ControllerBase
    {
        /// <summary>
        /// 获得班级某科目成绩信息
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetCourseInfo")]
        public ActionResult<List<Chengji>> GetCourseInfo(string classid, string subid)
        {
            Console.WriteLine("Class Id:" + classid);
            Console.WriteLine("Sub Id:" + subid);
            //获得班级的学生信息
            var students = Dataset.StudentList.Where(x => x.ClassId.Equals(classid)).Select(y => y.ID).ToList();
            return Dataset.ChengjiList.Where(x => x.SubId.Equals(subid) && students.Contains(x.StudentID)).ToList();
        }

        /// <summary>
        /// 获得某班级某课程某次考试的信息
        /// </summary>
        /// <param name="classid"></param>
        /// <param name="subid"></param>
        /// <param name="TestId"></param>
        /// <returns></returns>
        [HttpGet("GetCourseInfoByTestId")]
        public ActionResult<List<Chengji>> GetCourseInfoByTestId(string classid, string subid, string TestId)
        {
            Console.WriteLine("Class Id:" + classid);
            Console.WriteLine("Sub Id:" + subid);
            Console.WriteLine("Test Id:" + TestId);
            //获得班级的学生信息
            var students = Dataset.StudentList.Where(x => x.ClassId.Equals(classid)).Select(y => y.ID).ToList();
            return Dataset.ChengjiList.Where(x => x.Id == TestId && x.SubId.Equals(subid) && students.Contains(x.StudentID)).ToList();
        }

        /// <summary>
        /// 七选三信息
        /// </summary>
        public class Overview
        {
            public List<NameValueSet> selectionCourseCnt { get; set; }
        }

        [HttpGet("GetOverview")]
        public ActionResult<Overview> GetOverview()
        {
            var o = new Overview();
            o.selectionCourseCnt = new List<NameValueSet>();
            var dic = new Dictionary<string, int>();
            foreach (var item in Chengji.OptionalSelect)
            {
                dic.Add(item, 0);
            }
            foreach (var student in Dataset.StudentList)
            {
                if (student.OptionCourse != null && student.OptionCourse.Count == 3)
                {
                    //选择了3们课程的才计算
                    dic[student.OptionCourse[0]]++;
                    dic[student.OptionCourse[1]]++;
                    dic[student.OptionCourse[2]]++;
                }
            }
            foreach (var key in dic.Keys)
            {
                o.selectionCourseCnt.Add(new NameValueSet() { name = key, value = dic[key] });
            }
            return o;
        }
    }
}
