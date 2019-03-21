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

        [HttpGet("QueryByStudentId")]
        public ActionResult<List<Student>> QueryByStudentId(string Id)
        {
            var baseInfo = Dataset.StudentList.Where(x => x.ID.Equals(Id)).ToList();
            return baseInfo;
        }

        [HttpGet("QueryByClassId")]
        public ActionResult<List<Student>> QueryByClassId(string Id)
        {
            var baseInfo = Dataset.StudentList.Where(x => x.ClassId.Equals(Id)).ToList();
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
                        return x.Sdate.CompareTo(y.Sdate);
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

                return info;
            }
            return null;
        }
    }
}
