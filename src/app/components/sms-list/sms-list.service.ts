import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { SmsList } from './SmsList';

@Injectable({
  providedIn: 'root',
})
export class SmsListService {
  private table = 'smslist';

  constructor(private dbService: NgxIndexedDBService) {}

  getAll() {
    return this.dbService.getAll(this.table);
  }

  get(id: number) {
    return this.dbService.getByID(this.table, id);
  }

  add(item: SmsList) {
    return this.dbService.add(this.table, item);
  }

  batch(items: SmsList[]) {
    return this.dbService.bulkAdd(this.table, items);
  }

  edit(item: SmsList) {
    return this.dbService.update(this.table, item);
  }

  delete(id: number) {
    return this.dbService.delete(this.table, id);
  }
}
