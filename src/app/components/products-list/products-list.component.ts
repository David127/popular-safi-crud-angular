import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/models/main.interface';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CreateProductComponent } from '../create-product/create-product.component';
import { switchMap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {


  displayedColumns: string[] = ['id', 'name', 'code', 'price', 'stock', 'action'];
  dataSource = new MatTableDataSource<Product>();

  products: Product[] = [];
  product: Product = {
    productId: 0,
    name: '',
    code: '',
    price: 0,
    stock: 0
  }

  apiService = inject(ApiServiceService);
  matDialog = inject(MatDialog);
  spinnerService = inject(SpinnerService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.spinnerService.show();
    this.apiService.getAll()
    .subscribe(response => {
      this.spinnerService.hide();
      this.products = response;
      this.dataSource.data = this.products;
      this.dataSource.paginator = this.paginator;
    });
  }

  openCreateDialog(): void {
    const dialog = this.matDialog.open(CreateProductComponent, {
      width: '400px'
    });

    dialog.afterClosed().subscribe((result: Product) => {
      if (result) {
        this.spinnerService.show();
        this.apiService.save(result)
        .pipe(
          switchMap(() => {
            return this.apiService.getAll();
          })
        )
        .subscribe(response => {
          this.spinnerService.hide();
          this.products = response;
          this.dataSource.data = this.products;
          this.dataSource.paginator = this.paginator;
        });
      }
    });
  }

  getProduct(product: Product): void {
    const { productId } = product;
    this.spinnerService.show();
    this.apiService.getById(productId)
    .subscribe(response => {
      this.spinnerService.hide();
      this.product = response
      this.openEditDialog(productId);
    });
  }

  private openEditDialog(productId: number): void {
    const dialog = this.matDialog.open(CreateProductComponent, {
      width: '400px',
      data: {
        product: this.product
      }
    });

    dialog.afterClosed().subscribe((result: Product) => {
      if (result) {
        this.spinnerService.show();
        this.apiService.update(productId, result)
          .pipe(
            switchMap(() => {
              return this.apiService.getAll();
            })
          )
          .subscribe(response => {
            this.spinnerService.hide();
            this.products = response;
            this.dataSource.data = this.products;
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }

  deleteProduct(product: Product): void {
    const { productId } = product;
    this.apiService.deleteById(productId)
      .pipe(
        switchMap(() => {
          return this.apiService.getAll();
        })
      )
      .subscribe(response => {
        this.products = response;
        this.dataSource.data = this.products;
      });
  }

}
