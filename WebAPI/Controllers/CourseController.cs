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
            /// <summary>
            /// 符合标准人数
            /// </summary>
            /// <value></value>
            public int StudentCnt { get; set; }
            public List<NameValueSet> selectionCourseCnt { get; set; }
            public List<NameValueSet> selectionTwoCourseCnt { get; set; }
            public List<NameValueSet> SelectionThreeCourseCnt { get; set; }
        }

        [HttpGet("GetOverview")]
        public ActionResult<Overview> GetOverview()
        {
            var o = new Overview();
            o.selectionCourseCnt = new List<NameValueSet>();
            o.selectionTwoCourseCnt = new List<NameValueSet>();
            o.SelectionThreeCourseCnt = new List<NameValueSet>();
            o.StudentCnt = Dataset.StudentList.Count(student => student.OptionCourse != null && student.OptionCourse.Count == 3);
            var dicSingle = new Dictionary<string, int>();
            var dicDouble = new Dictionary<string, int>();
            var dicCombine = new Dictionary<string, int>();
            foreach (var item in Chengji.OptionalSelect)
            {
                dicSingle.Add(item, 0);
            }
            foreach (var student in Dataset.StudentList)
            {
                if (student.OptionCourse != null && student.OptionCourse.Count == 3)
                {
                    //选择了3们课程的才计算
                    dicSingle[student.OptionCourse[0]]++;
                    dicSingle[student.OptionCourse[1]]++;
                    dicSingle[student.OptionCourse[2]]++;

                    var key = student.OptionCourse[0] + "/" + student.OptionCourse[1] + "/" + student.OptionCourse[2];
                    if (dicCombine.ContainsKey(key))
                    {
                        dicCombine[key]++;
                    }
                    else
                    {
                        dicCombine.Add(key, 1);
                    }

                    key = student.OptionCourse[0] + "/" + student.OptionCourse[1];
                    if (dicDouble.ContainsKey(key))
                    {
                        dicDouble[key]++;
                    }
                    else
                    {
                        dicDouble.Add(key, 1);
                    }
                    key = student.OptionCourse[0] + "/" + student.OptionCourse[2];
                    if (dicDouble.ContainsKey(key))
                    {
                        dicDouble[key]++;
                    }
                    else
                    {
                        dicDouble.Add(key, 1);
                    }
                    key = student.OptionCourse[1] + "/" + student.OptionCourse[2];
                    if (dicDouble.ContainsKey(key))
                    {
                        dicDouble[key]++;
                    }
                    else
                    {
                        dicDouble.Add(key, 1);
                    }
                }
            }
            foreach (var key in dicSingle.Keys)
            {
                o.selectionCourseCnt.Add(new NameValueSet() { name = key, value = dicSingle[key] });
            }
            foreach (var key in dicDouble.Keys)
            {
                o.selectionTwoCourseCnt.Add(new NameValueSet() { name = key, value = dicDouble[key] });
            }
            foreach (var key in dicCombine.Keys)
            {
                o.SelectionThreeCourseCnt.Add(new NameValueSet() { name = key, value = dicCombine[key] });
            }
            return o;
        }
    }
}
