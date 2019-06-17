using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using static Education.Controllers.ClassController;
using static Utility;

namespace Education.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchoolController : ControllerBase
    {

        /// <summary>
        /// 概要
        /// </summary>
        public class Overview
        {
            public Campus BaiYang { get; set; }

            public Campus East { get; set; }

            public Campus Total { get; set; }

            public RoomCntInfo SchoolRooms { get; set; }

            public List<GradeClassInfo> gradeClassInfoList { get; set; }

            public int totalWorkdaycnt { get; set; }

        }

        /// <summary>
        /// 校区信息    
        /// </summary>
        public class Campus
        {

            public StudentGroupProperty Property { get; set; }

            /// <summary>
            /// 性别比例
            /// </summary>
            /// <value></value>
            public PNRateItem Grade1SexRate { get; set; }
            /// <summary>
            /// 性别比例
            /// </summary>
            /// <value></value>
            public PNRateItem Grade2SexRate { get; set; }
            /// <summary>
            /// 性别比例
            /// </summary>
            /// <value></value>
            public PNRateItem Grade3SexRate { get; set; }

            /// <summary>
            /// 教师数
            /// </summary>
            /// <value></value>
            public int TeacherCnt { get; set; }
            /// <summary>
            /// 按照科目统计老师人数
            /// </summary>
            /// <value></value>
            public Dictionary<string, int> TeacherSubCnt { get; set; }

            /// <summary>
            /// 班级数
            /// </summary>
            /// <value></value>
            public int ClassCnt { get; set; }
            /// <summary>
            /// 国际部班级数
            /// </summary>
            /// <value></value>
            public int ClassIBCnt { get; set; }
        }

        /// <summary>
        /// 一批学生的基本属性的统计
        /// </summary>
        public class StudentGroupProperty
        {
            private List<Student> _studentlist;

            public StudentGroupProperty(List<Student> students)
            {
                _studentlist = students;
            }

            /// <summary>
            /// 学生数
            /// </summary>
            /// <value></value>
            public int StudentCnt
            {
                get
                {
                    return _studentlist.Count();
                }
            }
            /// <summary>
            /// 整体性别比例
            /// </summary>
            /// <value></value>
            public PNRateItem SexRate
            {
                get
                {
                    return new PNRateItem
                    {
                        PosCnt = _studentlist.Count(x => x.Sex == "男"),
                        NegCnt = _studentlist.Count(x => x.Sex == "女"),
                    };
                }
            }

            public PNRateItem LiveAtSchoolRate
            {
                get
                {
                    return new PNRateItem
                    {
                        PosCnt = _studentlist.Count(x => x.LiveAtSchool),
                        NegCnt = _studentlist.Count(x => !x.LiveAtSchool),
                    };
                }
            }

            public PNRateItem ZheJiangRate
            {
                get
                {
                    return new PNRateItem
                    {
                        PosCnt = _studentlist.Count(x => x.IsNativePlaceZheJiang),
                        NegCnt = _studentlist.Count(x => !x.IsNativePlaceZheJiang),
                    };
                }
            }


            /// <summary>
            /// 国际部
            /// </summary>
            /// <value></value>
            public int StudentIBCnt
            {
                get
                {
                    return _studentlist.Count(x => x.ClassName.Contains("IB"));
                }
            }
            /// <summary>
            /// 政治面貌
            /// </summary>
            /// <value></value>
            public List<NameValueSet> Policy
            {
                get
                {
                    return _studentlist.GroupBy(x => x.Policy).Select(x =>
                    {
                        return new NameValueSet()
                        {
                            name = x.Key,
                            value = x.Count()
                        };
                    }).ToList();
                }
            }
            /// <summary>
            /// 民族
            /// </summary>
            /// <value></value>
            public List<NameValueSet> Nation
            {
                get
                {
                    return _studentlist.GroupBy(x => x.Nation).Select(x =>
                    {
                        return new NameValueSet()
                        {
                            name = x.Key,
                            value = x.Count()
                        };
                    }).ToList();
                }
            }
            /// <summary>
            /// 生源地
            /// </summary>
            /// <value></value>
            public List<NameValueSet> NativePlace
            {
                get
                {
                    //获得地理信息
                    var geodic = new Dictionary<string, int>();
                    foreach (var province in Utility.Provinces)
                    {
                        geodic.Add(province, 0);
                    }
                    foreach (var item in _studentlist)
                    {
                        var x = Utility.GetProvince(item.NativePlace);
                        if (!string.IsNullOrEmpty(x))
                        {
                            geodic[x]++;
                        }
                        else
                        {
                            //对于浙江省的修正
                            foreach (var city in Utility.ZhejiangCity)
                            {
                                if (item.NativePlace.Contains(city.Substring(0, 2)))
                                {
                                    geodic["浙江"]++;
                                    break;
                                }
                            }
                        }
                    }
                    var rtn = new List<NameValueSet>();
                    foreach (var k in geodic.Keys)
                    {
                        rtn.Add(new NameValueSet() { name = k, value = geodic[k] });
                    }
                    return rtn;
                }
            }

            public List<NameValueSet> NativePlaceZheJiang
            {
                get
                {
                    //获得地理信息
                    var geodic = new Dictionary<string, int>();
                    foreach (var city in Utility.ZhejiangCity)
                    {
                        geodic.Add(city, 0);
                    }
                    foreach (var item in _studentlist)
                    {
                        var x = Utility.GetProvince(item.NativePlace);
                        if (!string.IsNullOrEmpty(x))
                        {
                            if (x == "浙江")
                            {
                                //明确是浙江的部分
                                foreach (var city in Utility.ZhejiangCity)
                                {
                                    if (item.NativePlace.Contains(city.Substring(0, 2)))
                                    {
                                        geodic[city]++;
                                        break;
                                    }
                                }
                            }
                        }
                        else
                        {
                            //未知的省份
                            foreach (var city in Utility.ZhejiangCity)
                            {
                                if (item.NativePlace.Contains(city.Substring(0, 2)))
                                {
                                    geodic[city]++;
                                    break;
                                }
                            }
                        }
                    }
                    var rtn = new List<NameValueSet>();
                    //Detail
                    foreach (var k in geodic.Keys)
                    {
                        rtn.Add(new NameValueSet() { name = k, value = geodic[k] });
                    }
                    //地图用
                    rtn.Add(new NameValueSet()
                    {
                        name = "-杭州市",
                        value = geodic["杭州市"] + geodic["建德市"] +
                                geodic["桐庐县"] + geodic["淳安县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-宁波市",
                        value = geodic["宁波市"] + geodic["余姚市"] + geodic["慈溪市"] +
                                geodic["象山县"] + geodic["宁海县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-温州市",
                        value = geodic["温州市"] + geodic["瑞安市"] + geodic["乐清市"] +
                                geodic["永嘉县"] + geodic["平阳县"] + geodic["苍南县"] +
                                geodic["文成县"] + geodic["泰顺县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-嘉兴市",
                        value = geodic["嘉兴市"] + geodic["海宁市"] + geodic["桐乡市"] + geodic["平湖市"] +
                                geodic["嘉善县"] + geodic["海盐县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-湖州市",
                        value = geodic["湖州市"] +
                                geodic["德清县"] + geodic["长兴县"] + geodic["安吉县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-绍兴市",
                        value = geodic["绍兴市"] + geodic["嵊州市"] + geodic["诸暨市"] +
                                geodic["新昌县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-金华市",
                        value = geodic["金华市"] + geodic["义乌市"] + geodic["永康市"] + geodic["兰溪市"] + geodic["东阳市"] +
                                geodic["武义县"] + geodic["浦江县"] + geodic["磐安县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-衢州市",
                        value = geodic["衢州市"] + geodic["江山市"] +
                                geodic["常山县"] + geodic["开化县"] + geodic["龙游县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-舟山市",
                        value = geodic["舟山市"] +
                                geodic["岱山县"] + geodic["嵊泗县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-台州市",
                        value = geodic["台州市"] + geodic["温岭市"] + geodic["临海市"] + geodic["玉环市"] +
                                geodic["三门县"] + geodic["天台县"] + geodic["仙居县"]
                    });
                    rtn.Add(new NameValueSet()
                    {
                        name = "-丽水市",
                        value = geodic["丽水市"] + geodic["龙泉市"] +
                                geodic["青田县"] + geodic["缙云县"] + geodic["遂昌县"] +
                                geodic["松阳县"] + geodic["云和县"] + geodic["庆元县"] + geodic["景宁畲族自治县"]
                    });
                    return rtn;
                }

            }

        }

        /// <summary>
        /// 获得概要
        /// /// </summary>
        /// <returns></returns>
        [HttpGet("GetOverview")]
        public ActionResult<Overview> GetOverview()
        {
            var SchoolOver = new Campus();
            var BaiYang = new Campus();
            var East = new Campus();

            SchoolOver.Property = new StudentGroupProperty(Dataset.StudentList);
            BaiYang.Property = new StudentGroupProperty(Dataset.StudentList.Where(z => z.Campus == "白").ToList());
            East.Property = new StudentGroupProperty(Dataset.StudentList.Where(z => z.Campus == "东").ToList());

            //只选择2018-2019-1学年的教师，教师可能会教多个班级，所以需要Distinct一下
            SchoolOver.TeacherCnt = Dataset.TeacherList.Where(x => x.Term == "2018-2019-1").Select(x => x.Id).Distinct().Count();
            SchoolOver.TeacherSubCnt = new Dictionary<string, int>();
            foreach (var teacherid in Dataset.TeacherList.Where(x => x.Term == "2018-2019-1").Select(x => x.Id).Distinct())
            {
                var teacher = Dataset.TeacherList.Where(x => x.Id == teacherid).First();
                if (!SchoolOver.TeacherSubCnt.ContainsKey(teacher.SubName)) SchoolOver.TeacherSubCnt.Add(teacher.SubName, 0);
                SchoolOver.TeacherSubCnt[teacher.SubName]++;
            }
            SchoolOver.ClassCnt = Dataset.StudentList.Select(x => x.ClassName).Distinct().Count(y => { return !y.Contains("未分班"); });
            SchoolOver.ClassIBCnt = Dataset.StudentList.Select(x => x.ClassName).Distinct().Count(y => { return y.Contains("IB"); });

            BaiYang.TeacherCnt = Dataset.TeacherList.Where(x => x.Term == "2018-2019-1" && x.Campus == "白").Select(x => x.Id).Distinct().Count();
            BaiYang.TeacherSubCnt = new Dictionary<string, int>();
            foreach (var teacherid in Dataset.TeacherList.Where(x => x.Term == "2018-2019-1" && x.Campus == "白").Select(x => x.Id).Distinct())
            {
                var teacher = Dataset.TeacherList.Where(x => x.Id == teacherid).First();
                if (!BaiYang.TeacherSubCnt.ContainsKey(teacher.SubName)) BaiYang.TeacherSubCnt.Add(teacher.SubName, 0);
                BaiYang.TeacherSubCnt[teacher.SubName]++;
            }
            BaiYang.ClassCnt = Dataset.StudentList.Where(z => z.Campus == "白").Select(x => x.ClassName).Distinct().Count(y => { return !y.Contains("未分班"); });
            BaiYang.ClassIBCnt = Dataset.StudentList.Where(z => z.Campus == "白").Select(x => x.ClassName).Distinct().Count(y => { return y.Contains("IB"); });


            East.TeacherCnt = Dataset.TeacherList.Where(x => x.Term == "2018-2019-1" && x.Campus == "东").Select(x => x.Id).Distinct().Count();
            East.TeacherSubCnt = new Dictionary<string, int>();
            foreach (var teacherid in Dataset.TeacherList.Where(x => x.Term == "2018-2019-1" && x.Campus == "东").Select(x => x.Id).Distinct())
            {
                var teacher = Dataset.TeacherList.Where(x => x.Id == teacherid).First();
                if (!East.TeacherSubCnt.ContainsKey(teacher.SubName)) East.TeacherSubCnt.Add(teacher.SubName, 0);
                East.TeacherSubCnt[teacher.SubName]++;
            }
            East.ClassCnt = Dataset.StudentList.Where(z => z.Campus == "东").Select(x => x.ClassName).Distinct().Count(y => { return !y.Contains("未分班"); });
            East.ClassIBCnt = Dataset.StudentList.Where(z => z.Campus == "东").Select(x => x.ClassName).Distinct().Count(y => { return y.Contains("IB"); });

            SchoolOver.Grade1SexRate = new PNRateItem();
            SchoolOver.Grade2SexRate = new PNRateItem();
            SchoolOver.Grade3SexRate = new PNRateItem();
            SchoolOver.Grade1SexRate.PosCnt = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassName.Contains("高一"));
            SchoolOver.Grade1SexRate.NegCnt = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassName.Contains("高一"));
            SchoolOver.Grade2SexRate.PosCnt = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassName.Contains("高二"));
            SchoolOver.Grade2SexRate.NegCnt = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassName.Contains("高二"));
            SchoolOver.Grade3SexRate.PosCnt = Dataset.StudentList.Count(x => x.Sex == "男" && x.ClassName.Contains("高三"));
            SchoolOver.Grade3SexRate.NegCnt = Dataset.StudentList.Count(x => x.Sex == "女" && x.ClassName.Contains("高三"));


            BaiYang.Grade1SexRate = new PNRateItem();
            BaiYang.Grade2SexRate = new PNRateItem();
            BaiYang.Grade3SexRate = new PNRateItem();
            BaiYang.Grade1SexRate.PosCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "男" && x.ClassName.Contains("高一"));
            BaiYang.Grade1SexRate.NegCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "女" && x.ClassName.Contains("高一"));
            BaiYang.Grade2SexRate.PosCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "男" && x.ClassName.Contains("高二"));
            BaiYang.Grade2SexRate.NegCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "女" && x.ClassName.Contains("高二"));
            BaiYang.Grade3SexRate.PosCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "男" && x.ClassName.Contains("高三"));
            BaiYang.Grade3SexRate.NegCnt = Dataset.StudentList.Count(x => x.Campus == "白" && x.Sex == "女" && x.ClassName.Contains("高三"));

            //东部校区只有高一，这里简化了
            East.Grade1SexRate = new PNRateItem();
            East.Grade1SexRate.PosCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "男" && x.ClassName.Contains("高一"));
            East.Grade1SexRate.NegCnt = Dataset.StudentList.Count(x => x.Campus == "东" && x.Sex == "女" && x.ClassName.Contains("高一"));

            //宿舍分析
            var RoomInfo = new RoomCntInfo();
            foreach (var student in Dataset.StudentList)
            {
                RoomInfo.AddStudent(student);
            }

            var gradeOneClassInfo = new GradeClassInfo();
            gradeOneClassInfo.label = "高一";
            gradeOneClassInfo.items = new List<ClassBaseInfo>();
            foreach (var item in Dataset.classBaseInfoList)
            {
                if (item.label.Contains("高一"))
                {
                    gradeOneClassInfo.items.Add(item);
                }
            }
            gradeOneClassInfo.items.Sort((x, y) => { return x.value.CompareTo(y.value); });


            var gradeTwoClassInfo = new GradeClassInfo();
            gradeTwoClassInfo.label = "高二";
            gradeTwoClassInfo.items = new List<ClassBaseInfo>();
            foreach (var item in Dataset.classBaseInfoList)
            {
                if (item.label.Contains("高二"))
                {
                    gradeTwoClassInfo.items.Add(item);
                }
            }
            gradeTwoClassInfo.items.Sort((x, y) => { return x.value.CompareTo(y.value); });


            var gradeThreeClassInfo = new GradeClassInfo();
            gradeThreeClassInfo.label = "高三";
            gradeThreeClassInfo.items = new List<ClassBaseInfo>();
            foreach (var item in Dataset.classBaseInfoList)
            {
                if (item.label.Contains("高三"))
                {
                    gradeThreeClassInfo.items.Add(item);
                }
            }
            gradeThreeClassInfo.items.Sort((x, y) => { return x.label.CompareTo(y.label); });

            return new Overview
            {
                Total = SchoolOver,
                BaiYang = BaiYang,
                East = East,
                SchoolRooms = RoomInfo,
                gradeClassInfoList = new List<GradeClassInfo>(){
                    gradeOneClassInfo,gradeTwoClassInfo,gradeThreeClassInfo
                },
                totalWorkdaycnt = Utility.GetTotalDaysCnt()
            };
        }


        public class RoomCntInfo
        {
            public Dictionary<string, int> BaiYangMale { get; set; }

            public Dictionary<string, int> BaiYangFemale { get; set; }

            public Dictionary<string, int> EastMale { get; set; }

            public Dictionary<string, int> EastFemale { get; set; }

            public RoomCntInfo()
            {
                BaiYangMale = new Dictionary<string, int>();
                BaiYangFemale = new Dictionary<string, int>();
                EastMale = new Dictionary<string, int>();
                EastFemale = new Dictionary<string, int>();
            }
            public void AddStudent(Student student)
            {
                if (!student.LiveRoomNo.Equals("-"))
                {
                    Dictionary<string, int> x;
                    if (student.Campus == "东")
                    {
                        if (student.Sex == "男")
                        {
                            x = EastMale;
                        }
                        else
                        {
                            x = EastFemale;
                        }
                    }
                    else
                    {
                        if (student.Sex == "男")
                        {
                            x = BaiYangMale;
                        }
                        else
                        {
                            x = BaiYangFemale;
                        }
                    }
                    if (!x.ContainsKey(student.LiveRoomNo))
                    {
                        x.Add(student.LiveRoomNo, 0);
                    }
                    x[student.LiveRoomNo]++;
                }
            }
        }
    }
}
