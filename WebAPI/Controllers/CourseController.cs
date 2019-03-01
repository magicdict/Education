using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

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


    }
}
