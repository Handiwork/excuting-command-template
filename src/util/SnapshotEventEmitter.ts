import * as vscode from 'vscode';
export class SnapshotEventEmitter<T> implements vscode.EventEmitter<T | undefined>{

  private _snapshot?: T;
  private eventEmitter = new vscode.EventEmitter<T>();


  public get snapshot() {
    return this._snapshot;
  }

  public get event() {
    const _this = this;
    return function (listener: (data: T | undefined) => any, thisArgs?: any, disposables?: vscode.Disposable[]) {
      listener(_this._snapshot);
      return _this.eventEmitter.event(listener, thisArgs, disposables);
    };
  }

  fire(data?: T | undefined): void {
    this._snapshot = data;
    this.eventEmitter.fire(data);
  }

  dispose() {
    this.eventEmitter.dispose();
  }

}