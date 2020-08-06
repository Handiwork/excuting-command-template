import * as vscode from 'vscode';

export class DisposableProvider implements vscode.Disposable {
  protected disposables: vscode.Disposable[] = [];

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}