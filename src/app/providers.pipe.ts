import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'providers'
})
export class ProvidersPipe implements PipeTransform {
  transform(providers: any[]): string {
    return providers.map((i)=>i.display).join(',');
  }
}