using System.Linq;
public class AIFeature
{

    public string StudentID { get; set; }

    public string SubName { get; set; }

    public float LastDengdi { get; set; }

    public float LastDengdiMean { get; set; }

    public float LastDiff { get; set; }


    public float ActDengdi { get; set; }

    public float PredDengdi { get; set; }

    public float Loss { get; set; }

    public string Message { get; set; }

    public AIFeature(string RawData)
    {
        var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
        StudentID = Items[0];
        SubName = Items[4];
        LastDengdi = string.IsNullOrEmpty(Items[6]) ? 0 : float.Parse(Items[6]);
        LastDengdiMean = string.IsNullOrEmpty(Items[7]) ? 0 : float.Parse(Items[7]);
        LastDiff = string.IsNullOrEmpty(Items[8]) ? 0 : float.Parse(Items[8]);
        ActDengdi = string.IsNullOrEmpty(Items[9]) ? 0 : float.Parse(Items[9]);
        PredDengdi = string.IsNullOrEmpty(Items[10]) ? 0 : float.Parse(Items[10]);
        Loss = string.IsNullOrEmpty(Items[11]) ? 0 : float.Parse(Items[11]);
        if (Items.Length > 12)
        {
            Message = Items[12];
        }
    }
}