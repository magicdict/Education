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

        [HttpGet("QueryByClassId")]
        public ActionResult<List<Student>> QueryByClassId(string Id)
        {
            var baseInfo = Dataset.StudentList.Where(x => x.ClassId.Equals(Id)).ToList();
            return baseInfo;
        }


        [HttpGet("QueryByStudentId")]
        public ActionResult<Student> QueryByStudentId(string Id)
        {
            var baseInfo = Dataset.StudentList.Where(x => x.ID.Equals(Id)).ToList();
            if (baseInfo.Count() == 0) return null;
            return baseInfo.First();
        }

        [HttpGet("QueryByLiveRoomNo")]
        public ActionResult<List<Student>> QueryByLiveRoomNo(string Id, string Campus)
        {
            if (!String.IsNullOrEmpty(Campus))
            {
                var baseInfo = Dataset.StudentList.Where(x => x.LiveRoomNo.Equals(Id) && x.Campus == Campus).ToList();
                if (baseInfo.Count() == 0) return null;
                return baseInfo;
            }
            else
            {
                var baseInfo = Dataset.StudentList.Where(x => x.LiveRoomNo.Equals(Id)).ToList();
                if (baseInfo.Count() == 0) return null;
                return baseInfo;
            }
        }

        [HttpGet("QueryByNation")]
        public ActionResult<List<Student>> QueryByNation(string Nation)
        {
            var baseInfo = Dataset.StudentList.Where(x => x.Nation.Equals(Nation)).ToList();
            if (baseInfo.Count() == 0) return null;
            return baseInfo;
        }

        [HttpGet("QueryByPolicy")]
        public ActionResult<List<Student>> QueryByPolicy(string Policy)
        {
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
