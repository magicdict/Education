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
        /// 获得某个班级的某次考试的某个科目的成绩列表
        /// </summary>
        /// <param name="IdForClass"></param>
        /// <returns></returns>
        [HttpGet("GetExamForSingleExam")]
        public ActionResult<List<Chengji>> GetExamForSingleExam(string IdForClass)
        {
            return Dataset.ChengjiList.Where(x => x.IdForClass == IdForClass).ToList();
        }

        public class ChengjiDataSet
        {
            public string Grade { get; set; }
            public string NumberName { get; set; }
            public List<String> SubNameList { get; set; }
        }

        public static Dictionary<string, List<ChengjiDataSet>> ExamNameList;
        /// <summary>
        /// 全校各个年级的考试列表
        /// </summary>
        public static void PrepareExamNameList()
        {
            ExamNameList = new Dictionary<string, List<ChengjiDataSet>>();
            var LastestTermChangji = Dataset.ChengjiList.Distinct(new Chengji()).Where(x => x.Term == "2018-2019-1").ToList();
            //各个年级考试的聚集
            foreach (var grade in new string[] { "高一", "高二", "高三" })
            {
                var GradeExam = LastestTermChangji.Where(x => x.Grade == grade).ToList();
                GradeExam.Sort((x, y) => { return x.SubId.CompareTo(y.SubId); });
                var GradeExamList = new List<ChengjiDataSet>();
                //Number和NumberName基本上是一一对应的，这里用NumberName是可以的
                var Grade1NumberNameRec = GradeExam.Select(x => x.NumberName).Distinct();
                foreach (var NumberName in Grade1NumberNameRec)
                {
                    var Grade1ChengjiDataSet = new ChengjiDataSet();
                    Grade1ChengjiDataSet.Grade = grade;
                    Grade1ChengjiDataSet.NumberName = NumberName;
                    Grade1ChengjiDataSet.SubNameList = GradeExam.Where(x => x.NumberName == NumberName && !string.IsNullOrEmpty(x.SubName))
                                                      .Select(x => x.SubName).Distinct().ToList();
                    if (Grade1ChengjiDataSet.SubNameList.Count > 0)
                    {
                        GradeExamList.Add(Grade1ChengjiDataSet);
                    }
                }
                ExamNameList.Add(grade, GradeExamList);
            }
        }
        [HttpGet("GetExamNameList")]
        public ActionResult<Dictionary<string, List<ChengjiDataSet>>> GetExamNameList()
        {
            return ExamNameList;
        }


        public class ExamInfoForNumberAndSubName
        {
            public List<ClassExamInfo> ClassExamInfoList { set; get; }
            public List<Chengji> Top10 { set; get; }
            public List<Chengji> Low10 { set; get; }
            public ClassExamInfo GradeInfo { set; get; }
        }
        /// <summary>
        /// 某个年级的某次考试的某个科目的班级单位的信息列表
        /// </summary>
        /// <param name="NumberName"></param>
        /// <param name="SubName"></param>
        /// <param name="Grade"></param>
        /// <returns></returns>
        [HttpGet("GetExamInfoByNumberAndSubName")]
        public ActionResult<ExamInfoForNumberAndSubName> GetExamInfoByNumberAndSubName(string NumberName, string SubName, string Grade)
        {
            var Result = new ExamInfoForNumberAndSubName();
            var All = Dataset.ChengjiList.Where(x => x.SubName == SubName && x.NumberName == NumberName && x.Grade == Grade).ToList();
            var dic = new Dictionary<string, List<Chengji>>();
            foreach (var item in All)
            {
                if (!dic.ContainsKey(item.ClassID)) dic.Add(item.ClassID, new List<Chengji>());
                dic[item.ClassID].Add(item);
            }
            var r = new List<ClassExamInfo>();
            var classidlist = dic.Keys.ToList();
            classidlist.Sort();
            foreach (var classid in classidlist)
            {
                var chengjis = dic[classid];
                r.Add(new ClassExamInfo(chengjis));
            }
            if (Grade == "高三")
            {
                //高三的ClassId混乱,所以按照ClassName再排序
                r.Sort((x, y) => { return x.Record.ClassName.CompareTo(y.Record.ClassName); });
            }
            //获得前10名和后10名
            All = All.Where(x => x.Score > 0).ToList();
            var topx = Math.Min(All.Count(), 10);
            All.Sort((x, y) => { return y.Score.CompareTo(x.Score); });  //降序
            var Top10 = All.Take(topx).ToList();
            All.Sort((x, y) => { return x.Score.CompareTo(y.Score); });  //升序
            var Low10 = All.Take(topx).ToList();

            Result.ClassExamInfoList = r;
            Result.Top10 = Top10;
            Result.Low10 = Low10;
            Result.GradeInfo = new ClassExamInfo(All);

            return Result;
        }

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
        /// 获得某班级某课程某次考试的成绩列表
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
