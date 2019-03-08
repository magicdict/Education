import requests                                                                      
from bs4 import BeautifulSoup 
import pandas as pd
 
url = "https://lishi.tianqi.com/qingdao/201603.html"                                                                                                                                                   
response = requests.get(url)                                                     
soup = BeautifulSoup(response.text, 'html.parser') 
tqtongji2=soup.find("div",{"class":"tqtongji2"})
ul_all=tqtongji2.find_all("ul")
data_all=[]
for i in ul_all:
    li_all=i.find_all("li")
    data=[]
    for j in li_all:
        data.append(j.text)
    data_all.append(data)
weather=pd.DataFrame(data_all)
weather.columns=["日期","最高气温","最低气温","天气","风向","风力"]
weather.drop([0],inplace=True)
weather.to_csv("xxx.csv",encoding="utf_8_sig")