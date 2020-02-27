export default class AxiosSugarStore {
  data: any;
  saveExecute(data: any): any {
    return data
  }
  getExecute(data) {
    return data
  }
  save(data) {
    this.data = this.saveExecute(data)
  }
  get(): any {
    return this.getExecute(this.data)
  }
}