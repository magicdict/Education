import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class CommonFunction {

    constructor(
        private http: Http
    ) { }


    /* 工具类 */
    public static checkNumbericRanger(text: string, max: number, min: number): number {
        if (CommonFunction.IsNullOrEmpty(text)) { return NaN; }
        const num = Number(text);
        if (isNaN(num)) { return NaN; }
        if (num > max || num < min) {
            return NaN;
        }
        return num;
    }


    /** 字符串是否为空（或空字符串）*/
    public static IsNullOrEmpty(text: string) {
        if (text === undefined) { return true; }
        if (text === null) { return true; }
        if (text === '') { return true; }
        return false;
    }

    /** 0.00 格式 */
    public static FormatNumberTwoDecimal(num: number) {
        let str = num.toString();
        if (str.indexOf('.') === -1) {
            str = str + '.00';
        }
        if (str.indexOf('.') === str.length - 2) {
            str = str + '0';
        }
        return str;
    }

    /** 0.0 格式 */
    public static FormatNumberOneDecimal(num: number) {
        let str = num.toString();
        if (str.indexOf('.') === -1) {
            str = str + '.0';
        }
        return str;
    }

    /** 四舍五入（保留两位小数） */
    public static roundvalue(num: number): number {
        let number: number;
        number = Math.round(num * 100);
        number = number / 100;
        return number;
    }


    public httpRequest<T>(serviceUrl: string): Promise<T> {
        let webapiurl = "http://39.105.206.6:8080/api/"
        //let webapiurl = "http://localhost:5000/api/"

        return this.http.get(
            webapiurl + serviceUrl
        )
            .toPromise()
            .then(response => {
                return response.json() as T;
            })
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any> {
        console.log('服务器访问失败');
        console.error('服务器访问失败', error);
        return Promise.reject(error.message || error);
    }
}

