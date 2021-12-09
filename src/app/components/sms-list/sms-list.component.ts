import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SmsListService } from './sms-list.service';
import { SmsList } from './SmsList';

@Component({
  selector: 'app-sms-list',
  templateUrl: './sms-list.component.html',
  styleUrls: ['./sms-list.component.sass'],
})
export class SmsListComponent implements OnInit {
  smsLists: SmsList[] = [];

  opened: boolean = false;
  edit: boolean = false;
  id: number = 0;

  form = new FormGroup({
    subject: new FormControl('', Validators.required),
    number: new FormControl('', Validators.required),
    datetime: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
  });

  alert: {
    status: boolean;
    type: string;
    message: string;
  } = { status: false, type: '', message: '' };

  constructor(private smsService: SmsListService) {}

  ngOnInit(): void {
    this.smsService.getAll().subscribe((res: any) => {
      this.smsLists = res;
    });
  }

  handleChange(id: number) {
    this.cleatAlert();
    this.opened = true;
    this.edit = true;
    this.form.reset();

    window.scroll({
      top: 0,
      behavior: 'smooth',
    });

    this.smsService.get(id).subscribe(
      (res: any) => {
        let { subject, number, datetime, message, id } = res;
        this.form.setValue({ subject, number, datetime, message });
        this.id = id;
      },
      (error: any) => {
        this.alert = {
          status: true,
          type: 'danger',
          message: 'Deu erro ao tentar editar esse sms!',
        };
        this.clearItems();
      }
    );
  }

  onEdit(items: SmsList) {
    items.id = this.id;
    this.smsService.edit(items).subscribe(
      (res) => {
        this.alert.status = true;
        this.alert.type = 'success';
        this.alert.message = 'Editado com sucesso';
        this.clearItems();
      },
      (error) => {
        this.alert.status = true;
        this.alert.type = 'danger';
        this.alert.message = 'Deu erro ao adicionar';
        this.clearItems();
      }
    );
    this.ngOnInit();
  }

  handleSubmit() {
    this.opened = true;
    this.edit = false;
    this.form.reset();
    this.id = 0;
    this.cleatAlert();
  }

  onSubmit() {
    this.smsService.add(this.form.value).subscribe((res) => {
      if (JSON.stringify(res)) {
        this.smsLists.push(res);
        this.alert.status = true;
        this.alert.type = 'success';
        this.alert.message = 'Adicionado com sucesso';
        this.clearItems();
      } else {
        this.alert.status = true;
        this.alert.type = 'danger';
        this.alert.message = 'Deu erro ao adicionar';
        this.clearItems();
      }
    });
  }

  handleDelete(id: number) {
    this.cleatAlert();
    this.smsService.delete(id).subscribe((res: any) => {
      if (JSON.stringify(res)) {
        this.smsLists = res;
        this.alert.status = true;
        this.alert.type = 'success';
        this.alert.message = 'Deletado com sucesso';
        this.clearItems();
      } else {
        this.alert.status = true;
        this.alert.type = 'danger';
        this.alert.message = 'Deu erro ao deletar';
        this.clearItems();
      }
    });
  }

  importCSV(event: Event) {
    let input: any = event?.target;

    const reader = new FileReader();
    reader.onload = () => {
      let text: any = reader.result;

      let result = this.csvJSON(text);

      result = result.map((item) => ({
        ...item,
        datetime: new Date(
          item.datetime.split('/').reverse().join('/')
        ).toISOString(),
      }));

      this.smsService.batch(result).subscribe(
        (res) => {
          this.alert.status = true;
          this.alert.type = 'success';
          this.alert.message = 'Adicionado com sucesso';
          this.clearItems();
          this.ngOnInit();
        },
        (error) => {
          this.alert.status = true;
          this.alert.type = 'danger';
          this.alert.message = 'Deu erro ao adicionar';
          this.clearItems();
        }
      );
    };
    reader.readAsText(input?.files[0]);
  }

  csvJSON(csv: any): SmsList[] {
    let lines = csv.split('\n');
    lines.pop();

    let result = [];
    let headers = lines[0].replace('\r', '').split(';');

    for (let i = 1; i < lines.length; i++) {
      let obj: any = {};
      let currentline = lines[i].split(';');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j].replace('\r', '');
      }

      result.push(obj);
    }
    return result;
  }

  clearItems() {
    this.opened = false;
    this.edit = false;
    this.form.reset();
    this.id = 0;
  }

  cleatAlert() {
    this.alert = { status: false, type: '', message: '' };
  }
}
