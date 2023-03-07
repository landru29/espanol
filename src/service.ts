import { map } from 'rxjs/operators';
import { AjaxResponse, ajax } from 'rxjs/ajax';
import { Observable } from 'rxjs';

export interface Vocabulary {
    es: string
    fr: string
  }

export class Service {
    static get(url: string): Observable<Vocabulary[]> {
        return ajax({
            url: `${url}?${makeid(5)}`,
        }).pipe(
            map((response: AjaxResponse<any>) => {
                return response.response.map((elt: any) => {
                    return elt as Vocabulary;
                });
            })
        );
    }
}

function makeid(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}