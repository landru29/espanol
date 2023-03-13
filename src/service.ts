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

    static gidList(): Observable<{(name: string):string}> {
        return ajax({
            url: (document as any).url,
            responseType: 'text',
        }).pipe(
            map((response: AjaxResponse<any>) => {
                return response.response.split("\n").reduce((all: {(name: string):string}, line: string)=>{
                    const splitter = line.trim().split(',');
                    (all as any)[`${splitter[splitter.length-1]}`] = splitter[0];
                    return all;
                }, {});
            })
        );
    }

    static getAll(desc:{(name: string): string}): Observable<{(name: string):Vocabulary[]}> {
        const idx = Object.keys(desc).map((name: string) => (desc as any)[name])
        
        const urls = idx.map((index) => {
            return `${(document as any).url}&gid=${index}`;
        });
        
        const obs = urls.map((url) => {
            return ajax<string>({
                url,
                responseType: 'text',
            }).pipe<Vocabulary[]>(
                map<AjaxResponse<string>, Vocabulary[]>((response: AjaxResponse<string>) => {
                    const lines = response.response.split("\n").map((elt: string) => elt.trim())
                    return lines.map((line: string) => {
                        const splited = line.split(',');
                        return {
                            fr: `${splited[0]}`.toLowerCase(),
                            es: `${splited[splited.length-1]}`.toLowerCase(),
                        } as Vocabulary
                    })
                }),
            ).pipe(
                map<Vocabulary[], {(name: string):Vocabulary[]}>((voc: Vocabulary[]) => {
                    const out: {(name: string):Vocabulary[]} = {} as {(name: string):Vocabulary[]};
                    (out as any)[`${(desc as any)[url]}`] = voc;
                    return out;
                }),
            )
        });

        return concat(...obs);
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