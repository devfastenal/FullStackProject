import { Component, Input, OnInit } from '@angular/core';
import { CityDetail } from '../../shared-sources/cities-model';
import { CitiesService } from '../../shared-sources/cities-service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmEventType } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastService } from '../../shared-sources/toast-service';

@Component({
  selector: 'app-cities-detailed-view',
  templateUrl: './cities-detailed-view.component.html',
  styleUrl: './cities-detailed-view.component.css'
})

export class CitiesDetailedViewComponent implements OnInit {
  id: number;
  city: CityDetail;
  cities: CityDetail[] = [];

  constructor(private toastService: ToastService, private service: CitiesService, private router: Router, private activeroute: ActivatedRoute, private confirmationService: ConfirmationService, private messageService: MessageService) {
  }
  ngOnInit(): void {

    this.activeroute.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.city = this.service.getCity(this.id);
    }
    );
  }
  edit(id: number) {
    this.service.Setvaluesinform(this.city);
    this.router.navigate(['../', id, 'edit'], { relativeTo: this.activeroute });
  }
  onDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteId(id).subscribe({
          next: res => {
            const index = this.service.list.findIndex(x => x.cityId === id);
            if (index !== -1) {
              this.service.list.splice(index, 1);
            } else {
              console.error("City with ID", id, "not found in the list.");
            }
            this.toastService.deletedToast();
            this.router.navigate(['../',], { relativeTo: this.activeroute });
          },
          error: err => {
            if (err.status === 403)
              this.toastService.customError('You are not an admin');
            else
              this.toastService.customError('Something went wrong');
          }
        });
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toastService.rejected();

            break;
          case ConfirmEventType.CANCEL:
            this.toastService.cancelled();

            break;
        }
      }
    });
  }
}

