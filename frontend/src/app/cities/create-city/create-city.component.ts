import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CitiesService } from '../../shared-sources/cities-service';
import { CityDetail } from '../../shared-sources/cities-model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, Message, PrimeNGConfig } from 'primeng/api';
import { ToastService } from '../../shared-sources/toast-service';

@Component({
  selector: 'app-create-city',
  templateUrl: './create-city.component.html',
  styleUrl: './create-city.component.css'
})
export class CreateCityComponent implements OnInit, AfterViewInit {
  @ViewChild('form') tempform: NgForm;
  id: number;
  accepted_add = false;
  msgs: Message[] = [];
  city: CityDetail;
  temp: CityDetail;
  //  tempcity:CityDetail;
  editMode = false;
  //  tempcity:CityDetail;
  constructor(private toastService: ToastService, public service: CitiesService, private router: Router, private activeroute: ActivatedRoute, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) { }
  ngOnInit() {
    //  this.service.startedediting.subscribe((tempcity:CityDetail)=>{
    //   this.editMode=true;

    //     this.tempform.setValue({cityName:tempcity.cityName,state:tempcity.state,country:tempcity.country,currency:tempcity.currency});
    //   });
    this.activeroute.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      if (this.editMode) {
        this.city = this.service.getCity(this.id);
      }
    });
    this.primengConfig.ripple = true;
  }
  ngAfterViewInit(): void {
    if (this.editMode) {
      Promise.resolve().then(() => {
        this.tempform.setValue({ cityName: this.city.cityName, state: this.city.state, country: this.city.country, currency: this.city.currency });
      })
    }
  }
  onSubmit(form: NgForm) {
    form.value.cityName = form.value.cityName.toUpperCase();
    if (this.editMode) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to Update?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.service.UpdateCity(this.id, form).subscribe({
            next: res => {
              const tempCity: CityDetail = { ...{ cityId: this.id } } as CityDetail;
              for (const controlName in form.controls) {
                if (form.controls[controlName].value) {
                  tempCity[controlName] = form.controls[controlName].value;
                }
              }
              tempCity['cityName'] = tempCity['cityName'].toUpperCase();
              const index = this.service.list.findIndex(x => x.cityId === this.id);
              this.service.list[index] = tempCity;
              this.toastService.updateToast();
              this.router.navigate(['../'], { relativeTo: this.activeroute })
            },
            error: err => {
              this.toastService.errorWhileAdd();
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
    else {

      this.confirmationService.confirm({
        message: 'Are you sure that you want to add this data?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.service.postdetails(form.value).subscribe({
            next: res => {
              this.service.refreshList().subscribe({
                next: res => {
                  this.service.list = res as CityDetail[];
                },
                error: err => { console.log(err) }
              });;
              this.tempform.form.reset();
              this.router.navigate(['../'], { relativeTo: this.activeroute });
              this.toastService.addedToast();

            },
            error: err => {
              console.log(err)
              this.toastService.errorWhileAdd();
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
}
