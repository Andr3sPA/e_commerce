import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card'
import { CurrencyPipe, NgOptimizedImage } from '@angular/common'
import { } from '@angular/common'
import { PATH_ID_MARKER, Product } from '../../models/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [MatCardModule, NgOptimizedImage, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  @Input({ required: true }) info!: Product
  path: string = ""

  ngOnInit() {
    this.path = `/${this.info.name}-${this.info.material}-${this.info.color}${PATH_ID_MARKER}${this.info.id}`
  }
}
