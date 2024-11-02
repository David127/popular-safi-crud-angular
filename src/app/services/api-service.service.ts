import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/main.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  http = inject(HttpClient);

  getAll() {
    return this.http.get<Product[]>('http://localhost:8090/api/products/all');
  }

  getById(id: number) {
    return this.http.get<Product>(`http://localhost:8090/api/products/${id}`);
  }

  save(productDto: Product) {
    return this.http.post<Product>('http://localhost:8090/api/products/save', productDto);
  }

  update(id: number, productDto: Product) {

    return this.http.post<Product>(`http://localhost:8090/api/products/update/${id}`, productDto);
  }

  deleteById(id: number) {
    return this.http.delete(`http://localhost:8090/api/products/delete/${id}`)
  }
}
