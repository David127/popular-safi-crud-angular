import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from 'src/app/models/main.interface';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {

  form!: FormGroup;

  formBuiler = inject(FormBuilder);

  product: Product = {
    productId: 0,
    name: '',
    code: '',
    price: 0,
    stock: 0
  }

  constructor(
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.buildForm();
    if (data && data.product) {
      this.product = data.product;
      this.form.patchValue(this.product);
    }
    this.form.get('productId')?.disable();
  }

  private buildForm(): void {
    this.form = this.formBuiler.group({
      productId: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required]
    });
  }

  save(event: Event): void {
    event.preventDefault();

    this.dialogRef.close(this.form.getRawValue());
  }
}
