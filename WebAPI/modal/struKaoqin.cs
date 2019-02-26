using System.Linq;
 public struct struKaoqin
    {
        public string controler_id;

        public string controler_name;

        public string control_task_order_id;

        public string control_task_name;

        public struKaoqin(string RawData)
        {
            var Items = RawData.Split(",").Select(x => x.Trim(Dataset.QMark)).ToArray();
            controler_id = Items[0];
            controler_name = Items[1];
            control_task_order_id = Items[2];
            control_task_name = Items[3];
        }

    }