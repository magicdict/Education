import requests

from bs4 import BeautifulSoup

import pandas as pd

import time


# 参数city为城市拼音,*years为年份参数（int类型）,若只传入一个数字则只爬取对应年份数据,若输入多个年份则默认以第一个年份为起始年,最后一个年份为终止年（例如传入2011,2018，则爬取2011到2018年天气数据），目前最久远的天气数据只有2011年的


def get_weather_historic_data(city, *years):
    res = []
    columns = ["日期","天气","温度"];
    for year in range(years[0], years[-1] + 1):

        print('正在获取%d年数据...' % (year))

        for month in range(1, 13):

            if month < 10:

                response = requests.get('https://m.tianqi.com/lishi/%s/%d0%d.html' % (city, year, month)).text

            else:

                response = requests.get('https://m.tianqi.com/lishi/%s/%d%d.html' % (city, year, month)).text

            soup = BeautifulSoup(response, "html.parser")

            # 检查是否找到该时段天气数据，没有则跳到下个月

            try:

                ul = soup.find_all('dl', class_='table_day15');

            except:

                continue

            # columns作为DataFrame对象的列名



            for i in range(0, len(ul)):
                r = ul[i].get_text().split('\n');
                res.append([str(year) + "/" + r[1].strip(),r[3],r[4]]);

    # 返回pandas中的dataframe数据类型

    return pd.DataFrame(res, columns=columns)


st = time.time()

# ningbo指的是宁波，2011是起始年份，2019是终止年份，即爬取2011到2019年宁波天气数据

df = get_weather_historic_data('ningbo', 2011, 2019)

# 保存成本地excel文件

#你想要保存文件的位置
df.to_csv(r'F:\Education\WebAPI\education_data\宁波历史天气数据.csv')


print('完成,用时', round(time.time() - st, 3), 's')
