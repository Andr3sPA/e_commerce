import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelToDisplay'
})
export class CamelToDisplayPipe implements PipeTransform {

  transform(value: string): string {

    value = value[0].toUpperCase() + value.substring(1)

    return value.replaceAll(/([a-z])([A-Z])/g, (_, m0, m1) => {
      return `${m0} ${m1.toLowerCase()}`
    })
  }

}
