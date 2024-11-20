// socket.module.ts
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://127.0.0.1:5000', options: {} }; // Replace with your backend WebSocket URL

@NgModule({
  imports: [SocketIoModule.forRoot(config)],
  exports: [SocketIoModule],
})
export class SocketModule {}
