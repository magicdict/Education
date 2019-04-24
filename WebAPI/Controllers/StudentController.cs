using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Education.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {

        public class CompareStudentInfo
        {
            public Student first { get; set; }
            public Student second { get; set; }
            public List<ChengjiSimple> ExamResult { get; set; }
        }

        [HttpGet("CompareStudent")]
        public ActionResult<CompareStudentInfo> CompareStudent(string firstId, string secondId)
        {
            //学生基础信息的获取
            var rtn = new CompareStudentInfo();

            rtn.first = QueryByStudentId(firstId).Value[0];
            rtn.second = QueryByStudentId(secondId).Value[0];
            var FirstExamResult = new List<ChengjiSimple>();
            var firstExams = Dataset.ChengjiList.Where(x => x.StudentID == firstId).ToList();
            var secondExams = Dataset.ChengjiList.Where(x => x.StudentID == secondId).ToList();

            foreach (var chengji in secondExams)
            {
                //First需要补充一些只有Second有的考试信息
                if (firstExams.Count(x => x.IdForGradeExam == chengji.IdForGradeExam) == 0)
                {
                    FirstExamResult.Add(new ChengjiSimple(chengji)
                    {
                        Result = "-",
                        Score = -4,
                        CompareToScore = chengji.Score
                    });
                }
            }

            foreach (var chengji in firstExams)
            {
                if (secondExams.Count(x => x.IdForGradeExam == chengji.IdForGradeExam) == 0)
                {
                    //First特有的考试
                    FirstExamResult.Add(new ChengjiSimple(chengji)
                    {
                        Result = "-8",
                        Score = chengji.Score,
                        CompareToScore = -4
                    });
                }
                else
                {
                    var c = secondExams.Find(x => x.IdForGradeExam == chengji.IdForGradeExam);
                    var result = "";
                    if (chengji.Score <= 0 || c.Score <= 0)
                    {
                        result = "-9";
                    }
                    else
                    {
                        if (chengji.Score == c.Score) result = "0";
                        if (chengji.Score > c.Score) result = "1";
                        if (chengji.Score < c.Score) result = "-1";
                    }
                    //双方都有的考试信息
                    FirstExamResult.Add(new ChengjiSimple(chengji)
                    {
                        CompareToScore = c.Score,
                        Result = result
                    });
                }
            }
            FirstExamResult.Sort((x, y) =>
            {
                if (x.Number == y.Number)
                {
                    return (x.SubId.CompareTo(y.SubId));
                }
                else
                {
                    return (x.Number.CompareTo(y.Number));
                }
            });
            rtn.ExamResult = FirstExamResult;
            return rtn;
        }


        [HttpGet("QueryByClassId")]
        public ActionResult<List<Student>> QueryByClassId(string Id)
        {
            var baseInfo = Dataset.StudentList.Where(x => x.ClassId.Equals(Id)).ToList();
            return baseInfo;
        }


        [HttpGet("QueryByStudentId")]
        public ActionResult<List<Student>> QueryByStudentId(string Id)
        {
            var baseInfo = Dataset.StudentList.Where(x => x.ID.Contains(Id)).ToList();
            if (baseInfo.Count() == 0) return null;
            return baseInfo;
        }

        [HttpGet("QueryByLiveRoomNo")]
        public ActionResult<List<Student>> QueryByLiveRoomNo(string Id, string Campus, string Sex)
        {
            Campus = System.Web.HttpUtility.UrlDecode(Campus);
            Sex = System.Web.HttpUtility.UrlDecode(Sex);
            var baseInfo = Dataset.StudentList.Where(x => x.LiveRoomNo.Equals(Id));
            if (!String.IsNullOrEmpty(Campus))
            {
                baseInfo = baseInfo.Where(x => x.Campus == Campus);
            }
            if (!String.IsNullOrEmpty(Sex))
            {
                baseInfo = baseInfo.Where(x => x.Sex == Sex);
            }
            if (baseInfo.Count() == 0) return null;
            return baseInfo.ToList();
        }

        [HttpGet("QueryByNation")]
        public ActionResult<List<Student>> QueryByNation(string Nation)
        {
            Nation = System.Web.HttpUtility.UrlDecode(Nation);
            var baseInfo = Dataset.StudentList.Where(x => x.Nation.Equals(Nation)).ToList();
            if (baseInfo.Count() == 0) return null;
            return baseInfo;
        }

        [HttpGet("QueryByPolicy")]
        public ActionResult<List<Student>> QueryByPolicy(string Policy)
        {
            Policy = System.Web.HttpUtility.UrlDecode(Policy);
            var baseInfo = Dataset.StudentList.Where(x => x.Policy.Equals(Policy)).ToList();
            if (baseInfo.Count() == 0) return null;
            return baseInfo;
        }

        /// <summary>
        /// 获得学生详细信息
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetStudentInfo")]
        public ActionResult<StudentInfo> GetStudentInfo(string Id)
        {
            Console.WriteLine("StudentID:" + Id);
            //获得基础信息
            var baseInfo = Dataset.StudentList.Where(x => x.ID.Equals(Id));
            if (baseInfo.Count() == 1)
            {
                //应该仅有一条记录
                var info = new StudentInfo();
                info.BaseInfo = baseInfo.First();
                //教师记录
                info.Teachers = Dataset.TeacherList.Where(x => x.ClassId == info.BaseInfo.ClassId).ToList();
                //考勤记录
                info.Kaoqins = Dataset.KaoqinList.Where(x => x.StudentID == info.BaseInfo.ID).ToList();
                info.Kaoqins.Sort(
                    (x, y) =>
                    {
                        return x.RecDateTime.CompareTo(y.RecDateTime);
                    }
                );
                //成绩记录
                info.Chengjis = Dataset.ChengjiList.Where(x => x.StudentID == info.BaseInfo.ID).ToList();
                info.Chengjis.Sort(
                    (x, y) =>
                    {
                        //不能用SDate比较，这里的日期有问题
                        return x.Id.CompareTo(y.Id);
                    }
                );
                //成绩件数
                info.ChengjiCnt = info.Chengjis.Count;
                //消费记录
                info.Consumptions = Dataset.ConsumptionList.Where(x => x.StudentID == info.BaseInfo.ID).ToList();
                info.Consumptions.Sort(
                    (x, y) =>
                    {
                        return x.DealTime.CompareTo(y.DealTime);
                    }
                );
                //消费件数
                info.ConsumptionCnt = info.Consumptions.Count;

                info.MonthlyConsumptions = Dataset.StudentConsumptionList.Where(x => x.ID == Id).ToList();

                //室友
                if (info.BaseInfo.LiveAtSchool)
                {
                    info.Roommate = Dataset.StudentList.Where(
                         x => x.Campus == info.BaseInfo.Campus &&
                         x.Sex == info.BaseInfo.Sex &&
                         x.LiveRoomNo == info.BaseInfo.LiveRoomNo).ToList();
                }
                return info;
            }
            return null;
        }
    }
}
