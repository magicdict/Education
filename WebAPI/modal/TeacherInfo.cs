using System.Linq;
using System.Collections.Generic;
using System;

public class TeacherInfo
{

    public Dictionary<string, List<string>> GroupByTerm = new Dictionary<string, List<string>>();
    public List<Teacher> Records { set; get; }
    public List<ClassExamInfo> ClassExams { set; get; }
}

