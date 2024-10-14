import { Component } from '@angular/core';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import config from '../../config';

@Component({
  selector: 'app-taste',
  standalone: true,
  imports: [MyModalComponent, FormsModule],
  templateUrl: './taste.component.html',
  styleUrl: './taste.component.css',
})
export class TasteComponent {
  constructor(private http: HttpClient) {}

  id: number = 0;
  foodTypeId: number = 0;
  name: string = '';
  remark: string = '';
  tastes: any[] = [];
  foodTypes: any[] = [];

  ngOnInit() {
    this.fetchDataFoodTypes();
    this.fetchData();
  }
  fetchDataFoodTypes() {
    try {
      this.http
        .get(config.apiServer + '/api/foodType/list')
        .subscribe((res: any) => {
          this.foodTypes = res.results;
          this.foodTypeId = this.foodTypes[0].id;
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  fetchData() {
    try {
      this.http
      .get(config.apiServer + '/api/taste/list')
      .subscribe((res: any) => {
        this.tastes = res.results;
      });
      
    } catch(e:any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      })
    }
  }

  save() {
    try {
      const payload = {
        id: this.id,
        foodTypeId: parseInt(this.foodTypeId.toString()),
        name: this.name,
        remark: this.remark,
      };
      if (this.id > 0) {
        this.http.put(config.apiServer + '/api/taste/update', payload)
        .subscribe((res: any) => {
          this.fetchData();
          this.id = 0
        });
      }else {
        this.http
          .post(config.apiServer + '/api/taste/create', payload)
          .subscribe((res: any) => {
            this.fetchData();
          });
      }

      document.getElementById('modalTaste_btnClose')?.click();

    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  edit(item: any) {
    this.foodTypeId = item.foodTypeId;
    this.name = item.name;
    this.id = item.id;
    this.remark = item.remark;
  }



  async remove(item: any) {
    try {
      const button = await Swal.fire({
        title: 'ลบข้อมูล',
        text: 'คุณต้องการลบข้อมูลใช่หรือไม่',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        this.http
          .delete(config.apiServer + '/api/taste/remove/' + item.id)
          .subscribe((res: any) => {
            this.fetchData();
          });
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  
}
