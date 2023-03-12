import { concatMap, map, tap, mergeMap } from 'rxjs/operators';
import { AjaxResponse, ajax } from 'rxjs/ajax';
import { Observable, from, concat } from 'rxjs';

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

    static gidList(): Observable<string[]> {
        return ajax({
            url: (document as any).url,
            responseType: 'text',
        }).pipe(
            map((response: AjaxResponse<any>) => {
                return response.response.split("\n").map((line: string)=>{
                    return line.trim().split(',')[0];
                })
            })
        );
    }

    static getAll(idx:string[]): Observable<Vocabulary[]> {
        const urls = idx.map((index) => {
            return `${(document as any).url}&gid=${index}`;
        });
        
        const obs = urls.map((url) => {
            return ajax<string>({
                url,
                responseType: 'text',
            }).pipe(
                map((response: AjaxResponse<string>) => {
                    const lines = response.response.split("\n").map((elt: string) => elt.trim())
                    return lines.map((line: string) => {
                        const splited = line.split(',');
                        return {
                            fr: `${splited[0]}`,
                            es: `${splited[splited.length-1]}`,
                        } as Vocabulary
                    })
                })
            )
        });

        return concat(...obs);
    }

    // static getAll(idx:string[]): Observable<any> {
    //     const urls = idx.map((index) => {
    //         return `${(document as any).url}&gid=${index}`;
    //     });
    //     console.log(urls);
    //     return from(urls).pipe(
    //         concatMap((url: string, id: number) => {
    //             console.log(url);
    //             return ajax<string>({
    //                 url,
    //                 responseType: 'text',
    //             })
    //         }),
    //         mergeMap((response: AjaxResponse<string>) => {
    //             const lines = response.response.split("\n").map((elt: string) => elt.trim())
    //             return lines.map((line: string) => {
    //                 const splited = line.split(',');
    //                 return {
    //                     fr: `${splited[0]}`,
    //                     es: `${splited[splited.length-1]}`,
    //                 } as Vocabulary
    //             })
    //         }),
    //         tap<Vocabulary>(voc => console.log("Decoded response", voc))
    //     )
    // }
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