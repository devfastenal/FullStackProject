import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private msgService: MessageService) { }

    addedToast() {
        this.msgService.add({ severity: 'success', summary: 'Success', detail: 'Added Successfully' });
    }
    deletedToast() {
        this.msgService.add({ severity: 'success', summary: 'Success', detail: 'Deleted Successfully' });

    }
    updateToast() {
        this.msgService.add({ severity: 'success', summary: 'Success', detail: 'Updated Successfully' });
    }
    cancelled() {
        this.msgService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
    }
    rejected() {
        this.msgService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
    }
    errorWhileAdd() {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured While Adding' });
    }
    updateError() {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured While Updating' });
    }
    customError(message: string) {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: message });
    }
    customSuccess(message: string) {
        this.msgService.add({ severity: 'success', summary: 'Success', detail: message });
    }
}