import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICart } from '../interfaces';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseService<ICart> {
  protected override source: string = 'carts';
  protected cartListSignal = signal<ICart[]>([]);

  get carts$() {
    return this.cartListSignal;
  }

  public getAllByUserId(id: number): ICart[] {
    this.findCarts(id).subscribe({
      next: (response: any) => {
        response.reverse();
        this.cartListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching carts', error);
      }
    });
    return [];
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.cartListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all carts request', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.description
        })
      }
    })
  }

  public save(item: ICart) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.cartListSignal.update((carts: ICart[]) => [response, ...carts]);
      },
      error: (error: any) => {
        console.error('response', error.description);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.description
        })
      }
    })
  }

  public update(item: ICart) {
    console.log('item', item);
    this.edit(item.id, item).subscribe({
      next: () => {
        const updatedItems = this.cartListSignal().map(card => card.id === item.id ? item : card);
        this.cartListSignal.set(updatedItems);
      },
      error: (error: any) => {
        console.error('response', error.description);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.description
        })
      }
    })
  }


  public delete(item: ICart) {
    this.del(item.id).subscribe({
      next: () => {
        this.cartListSignal.set(this.cartListSignal().filter(cart => cart.id != item.id));
      },
      error: (error: any) => {
        console.error('response', error.description);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.description
        })
      }
    })
  }
}
