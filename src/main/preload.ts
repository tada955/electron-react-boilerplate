// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import HCCM_Model from '../renderer/dataClasses/HCCMModel';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    clearChannel(channel: string) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
  initialiseDB: () => ipcRenderer.invoke('db:initialise'),
  readAllEntities: () => ipcRenderer.invoke('entity:readAll'),
  saveModel: (mod: HCCM_Model) => ipcRenderer.invoke('model:save', mod),
  openModel: () => ipcRenderer.invoke('model:open'),
  onSaveModel: (callback) => ipcRenderer.on('on-save-click', (_event, value) => callback(value))
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
