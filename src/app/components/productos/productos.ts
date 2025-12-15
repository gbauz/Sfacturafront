import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ApiConfig } from '../../api.config';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export class ProductoDto {
  codigo!: string;
  nombre!: string;
  precio!: number;
  stock!: number;
  familiaProductoId!: number; // se enviará fijo, no se edita
}

export class ProductoResultDto {
  id!: number;
  codigo!: string;
  nombre!: string;
  precio!: number;
  stock!: number;
  familiaProductoId!: number;
  familiaNombre?: string;
  fechaCreacion?: string;
}

@Component({
  selector: 'app-formularioproducto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class Formularioproducto implements OnInit {

  // ✅ Familia fija (no se edita en UI)
  private readonly FAMILIA_ID_FIJA = 1;

  productoForm: FormGroup;
  productosDataSource = new MatTableDataSource<ProductoResultDto>([]);

  // ✅ Quitado familiaProductoId de la tabla
  displayedColumns: string[] = ['id', 'codigo', 'nombre', 'precio', 'stock', 'acciones'];

  selectedProducto: ProductoResultDto | null = null;

  private endpoint = `${ApiConfig.baseUrl}/Productoes`;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(15)]],
      nombre: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      // ❌ familiaProductoId fuera del form
    });
  }

  ngOnInit(): void {
    this.getProductos();
  }

  // getters
  get codigo() { return this.productoForm.get('codigo')!; }
  get nombre() { return this.productoForm.get('nombre')!; }
  get precio() { return this.productoForm.get('precio')!; }
  get stock() { return this.productoForm.get('stock')!; }

  // GET
  getProductos(): void {
    this.http.get<any>(this.endpoint).subscribe({
      next: (response) => {
        let data: ProductoResultDto[] = [];
        if (Array.isArray(response)) data = response;
        else if (Array.isArray(response?.data)) data = response.data;
        this.productosDataSource.data = data;
      },
      error: (err) => console.error('Error GET productos:', err)
    });
  }

  // POST / PUT
  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    // ✅ familiaProductoId siempre fijo
    const payload: ProductoDto = {
      codigo: this.productoForm.value.codigo,
      nombre: this.productoForm.value.nombre,
      precio: Number(this.productoForm.value.precio),
      stock: Number(this.productoForm.value.stock),
      familiaProductoId: this.FAMILIA_ID_FIJA
    };

    if (this.selectedProducto) {
      // PUT
      const url = `${this.endpoint}/${this.selectedProducto.id}`;
      this.http.put(url, payload).subscribe({
        next: () => {
          this.getProductos();
          this.cancelEdit();
        },
        error: (err) => console.error('Error PUT producto:', err)
      });
    } else {
      // POST
      this.http.post(this.endpoint, payload).subscribe({
        next: () => {
          this.getProductos();
          this.productoForm.reset({ stock: 0 });
        },
        error: (err) => console.error('Error POST producto:', err)
      });
    }
  }

  // Edit
  editProducto(p: ProductoResultDto): void {
    this.selectedProducto = p;
    this.productoForm.setValue({
      codigo: p.codigo,
      nombre: p.nombre,
      precio: p.precio,
      stock: p.stock
      // ❌ familiaProductoId no se setea
    });
  }

  cancelEdit(): void {
    this.selectedProducto = null;
    this.productoForm.reset({ stock: 0 });
  }

  // DELETE
  deleteProducto(id: number): void {
    const url = `${this.endpoint}/${id}`;
    this.http.delete(url).subscribe({
      next: () => this.getProductos(),
      error: (err) => console.error('Error DELETE producto:', err)
    });
  }
}
