# -*- coding: utf-8 -*-
import pandas as pd
import lightgbm as lgb

path = './data/'

teacher = pd.read_csv(path + '1_teacher.csv')
student = pd.read_csv(path + '2_student_info.csv')
kaoqin = pd.read_csv(path + '3_kaoqin.csv')
kaoqintype = pd.read_csv(path + '4_kaoqintype.csv')
kaoqin = kaoqin.merge(kaoqintype[['control_task_order_id', 'control_task_name']], 'left', 'control_task_order_id')
kaoqin = kaoqin.merge(student, 'left', left_on='bf_studentID', right_on='bf_StudentID')
chengji = pd.read_csv(path + '5_chengji.csv')
exam_type = pd.read_csv(path + '6_exam_type.csv')
consumption = pd.read_csv(path + '7_consumption.csv')

data = chengji[
    (~chengji.mes_dengdi.isnull()) &
    (chengji.mes_Score > 0) &
    (~chengji['mes_sub_name'].isnull())
    ][
    ['mes_StudentID', 'exam_term', 'mes_TestID', 'mes_sub_name', 'mes_Score', 'exam_sdate', 'mes_dengdi']]
data = data[data.mes_StudentID.isin(student.bf_StudentID)]

data = data.sort_values(['mes_StudentID', 'mes_sub_name', 'mes_TestID']).reset_index(drop=True)

data = data.merge(student, 'left', left_on=['mes_StudentID'], right_on=['bf_StudentID'])
data = data.merge(teacher, 'left', left_on=['exam_term', 'cla_id', 'mes_sub_name'],
                  right_on=['term', 'cla_id', 'sub_Name'])
data['last_dengdi_1'] = data.groupby(['mes_StudentID', 'mes_sub_name'])['mes_dengdi'].shift(1)
data['last_dengdi_2'] = data.groupby(['mes_StudentID', 'mes_sub_name'])['mes_dengdi'].shift(2)
data['last_dengdi_3'] = data.groupby(['mes_StudentID', 'mes_sub_name'])['mes_dengdi'].shift(3)
data['last_dengdi_4'] = data.groupby(['mes_StudentID', 'mes_sub_name'])['mes_dengdi'].shift(4)

data['last_dengdi_mean'] = data[['last_dengdi_1', 'last_dengdi_2', 'last_dengdi_3']].mean(axis=1)
data['last_up'] = data['last_dengdi_1'] - data['last_dengdi_2']

data['is_up'] = data[['last_dengdi_1', 'last_dengdi_2', 'last_dengdi_3', 'last_dengdi_4']].apply(
    lambda x: 1 if x['last_dengdi_1'] > x['last_dengdi_2'] and x['last_dengdi_2'] > x['last_dengdi_3'] and x[
        'last_dengdi_3'] > x['last_dengdi_4'] and x['last_dengdi_1'] - x['last_dengdi_4'] > 0.2 else 0, axis=1)

data['msg'] = ''
data.loc[data['last_dengdi_1'] > 0.7, 'msg'] = data[data['last_dengdi_1'] > 0.7][['last_dengdi_1', 'msg']].apply(
    lambda x: x['msg'] + '上一次该科目等第为' + str(x['last_dengdi_1'])[:4] + ';', axis=1)

data.loc[(data['last_dengdi_mean'] > 0.7) & (~data['last_dengdi_3'].isnull()), 'msg'] = \
    data[(data['last_dengdi_mean'] > 0.7) & (~data['last_dengdi_3'].isnull())][
        ['last_dengdi_mean', 'msg']].apply(
        lambda x: x['msg'] + '前三次该科目平均等第为' + str(x['last_dengdi_mean'])[:4] + ';', axis=1)

data.loc[(data['last_up'] > 0.2) & (~data['last_dengdi_2'].isnull()), 'msg'] = \
    data[(data['last_up'] > 0.2) & (~data['last_dengdi_2'].isnull())][
        ['last_up', 'msg']].apply(
        lambda x: x['msg'] + '上一次考试中，该科目等第升高' + str(x['last_up'])[:4] + ';', axis=1)

data.loc[(data['is_up'] == 1) & (~data['last_dengdi_4'].isnull()), 'msg'] = \
    data[(data['is_up'] == 1) & (~data['last_dengdi_4'].isnull())][
        ['is_up', 'msg']].apply(
        lambda x: x['msg'] + '该科目连续三次等第升高;', axis=1)

data['time_sid'] = data['exam_term'].astype(str) + data['mes_StudentID'].astype(str)
kaoqin['time_sid'] = kaoqin['qj_term'].astype(str) + kaoqin['bf_studentID'].astype(str)

kaoqin_count = ['kaoqin_count']
data['kaoqin_count'] = data['time_sid'].map(kaoqin['time_sid'].value_counts())
for i in kaoqin.ControllerID.unique():
    kaoqin_count.append('kaoqin_count' + str(i))
    data['kaoqin_count' + str(i)] = data['time_sid'].map(kaoqin[kaoqin.ControllerID == i]['time_sid'].value_counts())
data[kaoqin_count] = data[kaoqin_count].fillna(0)
#
# for kaoqin_type in [[99003, '早退'], [99001, '迟到'], ]:
#     key = 'kaoqin_count' + str(kaoqin_type[0])
#     data.loc[data[key] > 1, 'msg'] = data[data[key] > 1][[key, 'msg']].apply(
#         lambda x: x['msg'] + '该学生该学期' + kaoqin_type[1] + '次数为' + str(int(x[key])) + '次;', axis=1)

cate_feature = ['mes_StudentID', 'mes_sub_name', 'exam_sdate'] + ['gra_Name', 'sub_id', 'bas_id']

num_feature = ['last_dengdi_1', 'last_dengdi_2', 'last_dengdi_3', 'last_dengdi_mean', 'last_dengdi_mean', 'last_up',
               'is_up'] + kaoqin_count
for i in cate_feature:
    data[i] = data[i].astype('category')
feature = cate_feature + num_feature

train_index = (data['exam_term'] < '2018-2019-1')
valid_index = (data['exam_term'] == '2018-2019-1')

lgb_model = lgb.LGBMRegressor(
    num_leaves=32, reg_alpha=0.1, reg_lambda=0.1, objective='mae',
    max_depth=-1, learning_rate=0.01, min_child_samples=20,
    n_estimators=5000, subsample=0.7, colsample_bytree=0.7, random_state=2019
)

train_x = data[train_index][feature]
train_y = data[train_index]['mes_dengdi']

valid_x = data[valid_index][feature]
valid_y = data[valid_index]['mes_dengdi']

lgb_model.fit(train_x, train_y, eval_set=[(valid_x, valid_y)],
              early_stopping_rounds=100,
              eval_metric='mae',
              categorical_feature=cate_feature,
              verbose=100
              )

pred = data[valid_index][
    ['mes_StudentID', 'bf_Name', 'bf_sex', 'cla_Name_x', 'mes_sub_name', 'exam_term', 'last_dengdi_1',
     'last_dengdi_mean', 'last_up', 'mes_dengdi',
     'msg']]
pred['pred_dengdi'] = lgb_model.predict(valid_x)
# pred['pred_dengdi'] = pd.qcut(pred['pred_dengdi'], 50)
# pred['pred_dengdi'] = pred['pred_dengdi'].astype(str)
# pred['pred_dengdi'] = pred['pred_dengdi'].map(dict(zip(pred['pred_dengdi'].sort_values().unique(), range(50))))
# pred['pred_dengdi'] = pred['pred_dengdi'] / 50

pred['loss'] = abs(pred['mes_dengdi'] - pred['pred_dengdi'])

pred['loss'] = pred['loss'].round(2)
pred['mes_dengdi'] = pred['mes_dengdi'].round(2)
pred['pred_dengdi'] = pred['pred_dengdi'].round(2)
pred['last_dengdi_1'] = pred['last_dengdi_1'].round(2)
pred['last_dengdi_mean'] = pred['last_dengdi_mean'].round(2)
pred['last_up'] = pred['last_up'].round(2)

pred = pred.drop_duplicates(
    ['mes_StudentID', 'bf_Name', 'bf_sex', 'cla_Name_x', 'mes_sub_name', 'exam_term'])

pred.loc[pred['pred_dengdi'] < 0.6, 'msg'] = ''
pred['msg_count'] = pred['msg'].apply(lambda x: len(x.split(';')) - 1)

pred[['mes_StudentID', 'bf_Name', 'bf_sex', 'cla_Name_x', 'mes_sub_name', 'exam_term', 'last_dengdi_1',
      'last_dengdi_mean', 'last_up', 'mes_dengdi', 'pred_dengdi', 'loss',
      'msg', 'msg_count']].to_csv(
    path + '/pred_dengdi.csv',
    index=False)

print('train over', pred['loss'].mean())
print('train over', abs(pred['mes_dengdi'] - pred['last_dengdi_1'].fillna(0.5)).mean())