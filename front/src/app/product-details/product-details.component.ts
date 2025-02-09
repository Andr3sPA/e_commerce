import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { PATH_ID_MARKER, Product } from '../../models/product';
import { mapKeys as mapProduct } from '../../utils/product';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  imports: [MatCardModule, MatButtonModule, NgOptimizedImage, CurrencyPipe, MatDividerModule, MatIconModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  httpClient = inject(HttpClient)
  productInfo?: Product

  @Input() set id(id: string) {
    const actualId = id.split(PATH_ID_MARKER)[1]
    //TODO: create service and store already retrieved products
    //TODO: add suggestions

    this.httpClient.get("http://localhost:8080/cloth/" + actualId)
      .subscribe({
        error: console.error,
        next: (res) => {
          this.productInfo = mapProduct(res)
          const history = JSON.parse(localStorage.getItem("browsing_history") ?? "[]") as string[]
          const unique = new Set(history)
          unique.add(id)
          localStorage.setItem("browsing_history", JSON.stringify(Array.from(unique)))
        },
      })

  }
}
