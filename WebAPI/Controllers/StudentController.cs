using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using static Education.Controllers.ClassController;
using static Education.Controllers.SchoolController;
using static Utility;

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

            public List<NameValueSet> SubResult { get; set; }
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

            //对于各科进行比较
            var SubNameList = FirstExamResult.Select(x => x.SubName).Distinct();
            rtn.SubResult = new List<NameValueSet>();
            foreach (var subname in SubNameList)
            {
                if (subname.Contains("总分")) continue;
                rtn.SubResult.Add(new NameValueSet()
                {
                    name = subname,
                    value = FirstExamResult
                            .Where(x => x.SubName == subname)
                            .Where(x => x.Result.Equals("1") || x.Result.Equals("-1"))
                            .Select(x => int.Parse(x.Result)).Sum()
                });
            }

            return rtn;
        }


        [HttpPost("QueryByFilter")]
        public ActionResult<List<Student>> QueryByFilter(dynamic data)
        {
            var baseInfo = Dataset.StudentList;
            List<String> ClassId = (data["ClassIds"] as JArray).ToObject<List<string>>();
            if (ClassId.Count != 0)
            {
                baseInfo = baseInfo.Where(x => ClassId.Contains(x.ClassId)).ToList();
            }
            else
            {
                return new List<Student>();
            }
            string Sex = data["Sex"].ToString();
            if (Sex != "")
            {
                baseInfo = baseInfo.Where(x => Sex == x.Sex).ToList();
            }
            string IsLiveAtSchool = data["IsLiveAtSchool"];
            if (IsLiveAtSchool != "")
            {
                if (IsLiveAtSchool == "是")
                {
                    baseInfo = baseInfo.Where(x => x.LiveAtSchool).ToList();
                }
                else
                {
                    baseInfo = baseInfo.Where(x => !x.LiveAtSchool).ToList();
                }
            }
            return baseInfo;
        }

        [HttpPost("VisualDateForFilter")]
        public ActionResult<ClassOverview> VisualDateForFilter(dynamic data)
        {
            ActionResult<List<Student>> StudentList = QueryByFilter(data);
            var StudentIds = StudentList.Value.Select(x => x.ID);
            var rtn = new ClassOverview();
            rtn.Property = new StudentGroupProperty(StudentList.Value);
            rtn.Kaoqing = new List<NameValueSet>();
            //只使用2018年的数据
            foreach (var key in Dataset.KaoqinTypeDic2018.Keys)
            {
                var cnt = 0;
                foreach (var sId in StudentIds)
                {
                    cnt += Dataset.KaoqinStudentIdDetail[sId + key];
                }
                if (cnt > 0)
                {
                    rtn.Kaoqing.Add(new NameValueSet()
                    {
                        name = Dataset.KaoqinTypeDic[key].control_task_name,
                        value = cnt
                    });
                }
            }
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
                //增加没有消费记录的日期
                foreach (var rec in Dataset.NoConsumptionList.Where(x => x.name == Id))
                {
                    var year = rec.value.ToString().Substring(0, 4);
                    var month = rec.value.ToString().Substring(4, 2);
                    var day = rec.value.ToString().Substring(6, 2);
                    info.Kaoqins.Add(new Kaoqin()
                    {
                        Id = "0",
                        Term = "2018-2019-1",
                        RecDateTime = year + "/" + month + "/" + day + " 09:00:00",
                        RecDateTimeYear = year,
                        RecDateTimeMonth = month,
                        RecDateTimeDay = day,
                        RecDateTimeHour = "09",
                        ControllerID = "99999",
                        ControllerName = "缺勤[无消费记录]",
                        DetailId = "9999999",
                        StudentID = Id,
                        StudentName = info.BaseInfo.Name,
                        ClassName = info.BaseInfo.ClassName,
                        ClassId = info.BaseInfo.ClassId,
                        DayOfWeek = new System.DateTime(int.Parse(year), int.Parse(month), int.Parse(day)).DayOfWeek
                    });
                }

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
