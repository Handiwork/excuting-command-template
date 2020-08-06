import * as vscode from 'vscode';

export class SnapshotEventEmitter<T> implements vscode.EventEmitter<T | undefined>{

  private _snapshot?: T;
  private eventEmitter = new vscode.EventEmitter<T | undefined>();


  public get snapshot() {
    return this._snapshot;
  }

  public get event() {
    return (listener: (data?: T) => any, thisArgs?: any, disposables?: vscode.Disposable[]) => {
      listener(this._snapshot);
      return this.eventEmitter.event(listener, thisArgs, disposables);
    };
  }

  fire(data?: T): void {
    this._snapshot = data;
    this.eventEmitter.fire(data);
  }

  dispose() {
    this.eventEmitter.dispose();
  }

}