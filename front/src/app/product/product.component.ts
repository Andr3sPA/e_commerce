import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card'
import { CurrencyPipe, NgOptimizedImage } from '@angular/common'
import { } from '@angular/common'
import { Product } from '../../models/product';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatCardModule, NgOptimizedImage, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input({ required: true }) info!: Product
}
