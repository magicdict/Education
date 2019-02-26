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
        /// <summary>
        /// 获得学生信息
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetStudentInfo")]
        public ActionResult<StudentInfo> GetStudentInfo(string Id)
        {
            Console.WriteLine("StudentID:" + Id);
            //获得基础信息
            var baseInfo = Dataset.StudentList.Where(x => x.bf_StudentID.Equals(Id));
            if (baseInfo.Count() == 1)
            {
                //应该仅有一条记录
                var info = new StudentInfo();
                info.BaseInfo = baseInfo.First();
                //教师记录
                info.Teachers = Dataset.TeacherList.Where(x => x.cla_id == info.BaseInfo.cla_id).ToList();
                //考勤记录
                info.Kaoqins = Dataset.KaoqinList.Where(x => x.bf_studentID == info.BaseInfo.bf_StudentID).ToList();
                //成绩记录
                info.Chengjis = Dataset.ChengjiList.Where(x => x.mes_StudentID == info.BaseInfo.bf_StudentID).ToList();
                //成绩件数
                info.ChengjiCnt = info.Chengjis.Count;
                //消费记录
                info.Consumptions = Dataset.ConsumptionList.Where(x => x.bf_studentID == info.BaseInfo.bf_StudentID).ToList();
                //消费件数
                info.ConsumptionCnt = info.Consumptions.Count;
                return info;
            }
            return null;
        }
    }
}
