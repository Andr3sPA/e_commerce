import { animate, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { ProductComponent } from "../product/product.component";
import { Product, Size, products, sizesOrdered } from './examples';
import { MatMenuModule } from '@angular/material/menu';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-browse',
    imports: [MatListModule, MatGridListModule, ProductComponent, MatSliderModule, MatCheckboxModule,
        MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, TitleCasePipe],
    templateUrl: './browse.component.html',
    styleUrl: './browse.component.css',
    animations: [
        trigger('gridChange', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.9)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
            ]),
        ]),
    ]
})
export class BrowseComponent implements OnInit {
  products = products;
  filteredProducts: Product[] = [];
  cols = 5;
  rowHeight = "10rem"
  filters: {
    price: [number, number],
    sizes: [Size, boolean][]
  } = {
      price: [0, 500],
      sizes: sizesOrdered.map(s => ([s, true]))
    }
  sorting = {
    price: "none",
    name: "none"
  }

  constructor(private bpObs: BreakpointObserver) {
    this.bpObs.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
    ]).subscribe(res => {
      if (res.breakpoints[Breakpoints.XSmall]) {
        this.cols = 2
        this.rowHeight = "6rem"
      } else if (res.breakpoints[Breakpoints.Small]) {
        this.cols = 3
        this.rowHeight = "8rem"
      } else if (res.breakpoints[Breakpoints.Medium]) {
        this.cols = 5
        this.rowHeight = "10rem"
      }
    })
  }

  ngOnInit(): void {
    // apply current filters
    this.applyFilters()
  }

  modifyPriceRange(which: "min" | "max", val: number) {
    this.filters.price[which === "min" ? 0 : 1] = val
  }

  toggleSizeFilter(idx: number) {
    this.filters.sizes[idx][1] = !this.filters.sizes[idx][1]
  }

  changeSorting(by: "name" | "price", dir: string) {
    this.sorting[by] = dir
  }

  sortProducts() {
    if (this.sorting.price === "none" && this.sorting.name === "none") {
      return
    }

    // TODO: define sort priority or smth
  }

  applyFilters() {
    this.filteredProducts = products.filter(p => {
      const priceFilter = p.price >= this.filters.price[0] && p.price <= this.filters.price[1]
      const sizeFilter = this.filters.sizes[sizesOrdered.indexOf(p.size)][1]
      return priceFilter && sizeFilter
    })
  }
}
