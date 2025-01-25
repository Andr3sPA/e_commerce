import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card'
import { Product } from '../browse/examples';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common'
import { } from '@angular/common'

@Component({
    selector: 'app-product',
    imports: [MatCardModule, NgOptimizedImage, CurrencyPipe],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input({ required: true }) info!: Product
}
