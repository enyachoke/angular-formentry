import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'identifiers'
})
export class IdentifiersPipe implements PipeTransform {
  transform(identifiers: any[]): string {
    return identifiers.map((i)=>i.identifier).join(',');
  }
}